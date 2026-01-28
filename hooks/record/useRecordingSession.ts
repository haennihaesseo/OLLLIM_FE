"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecordingStatus = "idle" | "recording" | "paused" | "stopped";

type RecorderMime =
  | "audio/webm;codecs=opus"
  | "audio/webm"
  | "audio/mp4"
  | "audio/aac"
  | "audio/ogg;codecs=opus"
  | "audio/ogg"
  | "";

function pickSupportedMime(): RecorderMime {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates: RecorderMime[] = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/aac",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "",
  ];
  for (const t of candidates) {
    if (!t) return "";
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

export function useRecordingSession() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // WebAudio (waveform)
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  // Mic stream
  const streamRef = useRef<MediaStream | null>(null);

  // RAF
  const animationRef = useRef<number | null>(null);
  const loopRef = useRef<((t: number) => void) | null>(null);

  // Bars: window + full
  const windowLevelsRef = useRef<number[]>([]);
  const fullLevelsRef = useRef<number[]>([]);
  const writeIndexRef = useRef(0);
  const lastSampleTimeRef = useRef(0);

  // MediaRecorder (real recording)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const mimeTypeRef = useRef<string>("");

  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  // Playback progress for canvas visualization
  const playbackProgressRef = useRef(0);

  // ===== tuning =====
  const BAR_COUNT = 70;
  const GAP = 3;
  const SAMPLE_INTERVAL = 50;

  const computeRMS = (data: Uint8Array) => {
    let sumSquares = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128; // -1~1
      sumSquares += v * v;
    }
    return Math.sqrt(sumSquares / data.length); // 0~1
  };

  const drawBars = useCallback(
    (levels: number[], playbackProgress = 0) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = canvas;
      const centerY = height / 2;
      const count = levels.length;
      if (count === 0) return;

      const barWidth = Math.max(2, (width - GAP * (count - 1)) / count);

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        const level = levels[i]; // 0~1
        const barHeight = level * (height * 0.9);
        const x = i * (barWidth + GAP);
        const y = centerY - barHeight / 2;
        
        // 재생 진행률에 따라 색상 변경
        const barProgress = (i + 1) / count;
        if (playbackProgress > 0 && barProgress <= playbackProgress) {
          ctx.fillStyle = "#e60023"; // primary-700
        } else {
          ctx.fillStyle = "#111827"; // gray-900
        }
        
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    },
    [GAP]
  );

  const drawFullTimeline = useCallback(() => {
    const full = fullLevelsRef.current;
    if (full.length === 0) return;

    const bucketCount = BAR_COUNT;
    const step = Math.max(1, Math.floor(full.length / bucketCount));
    const summarized: number[] = [];

    for (let i = 0; i < bucketCount; i++) {
      const start = i * step;
      const end = Math.min(full.length, start + step);
      let max = 0;
      for (let j = start; j < end; j++) {
        if (full[j] > max) max = full[j];
      }
      summarized.push(max);
    }

    drawBars(summarized, playbackProgressRef.current);
  }, [BAR_COUNT, drawBars]);
  
  const updatePlaybackProgress = useCallback((progress: number) => {
    playbackProgressRef.current = progress;
    drawFullTimeline();
  }, [drawFullTimeline]);

  // loop (bar waveform sampling)
  useEffect(() => {
    loopRef.current = (t: number) => {
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;
      if (!analyser || !dataArray) return;

      analyser.getByteTimeDomainData(dataArray);

      // paused면 샘플링/렌더 중단 (마지막 캔버스는 유지)
      if (status !== "recording") return;

      // 첫 실행 시 기준 시간 설정
      if (lastSampleTimeRef.current === 0) {
        lastSampleTimeRef.current = t;
        // 첫 실행은 샘플링하지 않고 다음 RAF로 진행
      } else if (t - lastSampleTimeRef.current >= SAMPLE_INTERVAL) {
        lastSampleTimeRef.current = t;

        const rms = computeRMS(dataArray);
        const level = Math.min(1, rms * 2.2);

        // 1) full
        fullLevelsRef.current.push(level);

        // 2) window circular buffer
        if (windowLevelsRef.current.length !== BAR_COUNT) {
          windowLevelsRef.current = Array.from({ length: BAR_COUNT }, () => 0);
          writeIndexRef.current = 0;
        }

        const idx = writeIndexRef.current;
        windowLevelsRef.current[idx] = level;
        writeIndexRef.current = (idx + 1) % BAR_COUNT;

        const ordered = Array.from({ length: BAR_COUNT }, (_, i) => {
          const bi = (writeIndexRef.current + i) % BAR_COUNT;
          return windowLevelsRef.current[bi];
        });

        drawBars(ordered);
      }

      animationRef.current = requestAnimationFrame((time) =>
        loopRef.current?.(time)
      );
    };
  }, [status, BAR_COUNT, SAMPLE_INTERVAL, drawBars]);

  const cleanupRAF = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const cleanupMedia = useCallback(async () => {
    // recorder stop은 stop()에서 명시적으로 처리
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    mimeTypeRef.current = "";

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    try {
      await audioContextRef.current?.close();
    } catch {
      // ignore
    }
    audioContextRef.current = null;

    analyserRef.current = null;
    dataArrayRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (status === "recording") return;

    // 새 녹음 시작 -> 기록 초기화
    windowLevelsRef.current = Array.from({ length: BAR_COUNT }, () => 0);
    fullLevelsRef.current = [];
    writeIndexRef.current = 0;
    lastSampleTimeRef.current = 0; // RAF 첫 실행 시 설정됨

    setAudioBlob(null); // 새 세션이므로 기존 녹음 제거

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    // WebAudio analyser
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.1;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    // MediaRecorder (real recording)
    const mimeType = pickSupportedMime();
    mimeTypeRef.current = mimeType;

    const recorder = new MediaRecorder(
      stream,
      mimeType ? { mimeType } : undefined
    );
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      // stop()에서 status를 먼저 stopped로 바꿔도 onstop은 비동기라 여기서 blob 확정
      const finalType =
        recorder.mimeType || mimeTypeRef.current || "audio/webm";
      const blob = new Blob(chunksRef.current, { type: finalType });
      setAudioBlob(blob);
    };

    recorder.start(); // 필요하면 timeslice를 줄 수도 있음(예: 1000)
    mediaRecorderRef.current = recorder;

    setStatus("recording");

    cleanupRAF();
    animationRef.current = requestAnimationFrame((t) => loopRef.current?.(t));
  }, [BAR_COUNT, cleanupRAF, status]);

  const pause = useCallback(() => {
    if (status !== "recording") return;

    // recording pause
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
    }

    setStatus("paused");
    cleanupRAF();
    // stream/context 유지, canvas 유지
  }, [cleanupRAF, status]);

  const resume = useCallback(() => {
    if (status !== "paused") return;

    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
    }

    setStatus("recording");
    lastSampleTimeRef.current = 0; // RAF 첫 실행 시 재설정됨

    cleanupRAF();
    animationRef.current = requestAnimationFrame((t) => loopRef.current?.(t));
  }, [cleanupRAF, status]);

  const stop = useCallback(() => {
    if (status === "idle") return;

    // RAF stop
    cleanupRAF();

    // recorder stop (blob은 onstop에서 확정)
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    // resources close
    // stream은 recorder가 stop되어도 남아있으니 직접 종료
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    audioContextRef.current?.close();
    audioContextRef.current = null;

    analyserRef.current = null;
    dataArrayRef.current = null;

    // 전체 파형 렌더
    drawFullTimeline();

    setStatus("stopped");
  }, [cleanupRAF, drawFullTimeline, status]);

  const reset = useCallback(() => {
    // 진행중이면 정리
    cleanupRAF();

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      // onstop에서 blob 생성될 수 있으므로 reset에서는 blob을 지워서 UX 일관성 유지
      try {
        recorder.stop();
      } catch {
        // ignore
      }
    }

    // 자원 종료
    cleanupMedia();

    // 기록 초기화
    windowLevelsRef.current = [];
    fullLevelsRef.current = [];
    writeIndexRef.current = 0;
    lastSampleTimeRef.current = 0;

    // canvas clear
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

    setAudioBlob(null);
    setStatus("idle");
  }, [cleanupMedia, cleanupRAF]);

  // unmount cleanup
  useEffect(() => {
    return () => {
      cleanupRAF();
      // recorder/stream/context 정리
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch {
          // ignore
        }
      }
      cleanupMedia();
    };
  }, [cleanupMedia, cleanupRAF]);

  return {
    canvasRef,
    status, // idle|recording|paused|stopped
    audioBlob, // stop 후 확정
    start,
    pause,
    resume,
    stop,
    reset,
    updatePlaybackProgress,
  };
}
