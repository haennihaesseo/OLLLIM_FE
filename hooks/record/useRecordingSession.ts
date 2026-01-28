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
  
  // Timeline draw animation
  const timelineAnimationRef = useRef<number | null>(null);
  const timelineAnimationStartRef = useRef(0);

  // MediaRecorder (real recording)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const mimeTypeRef = useRef<string>("");

  const [status, setStatus] = useState<RecordingStatus>("idle");
  const statusRef = useRef<RecordingStatus>("idle"); // RAF loop에서 최신 상태 참조용
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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

      // Canvas의 실제 표시 크기 사용 (devicePixelRatio 고려)
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;
      const count = levels.length;
      if (count === 0) return;

      const barWidth = Math.max(2, (width - GAP * (count - 1)) / count);

      // Canvas의 내부 해상도로 clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  const drawFullTimeline = useCallback((visibleRatio = 1) => {
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

    // 애니메이션: visibleRatio만큼만 표시
    const visibleCount = Math.ceil(summarized.length * visibleRatio);
    const visibleBars = summarized.slice(0, visibleCount);
    
    drawBars(visibleBars, playbackProgressRef.current);
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
      if (statusRef.current !== "recording") return;

      // 첫 실행 시 기준 시간 설정
      if (lastSampleTimeRef.current === 0) {
        lastSampleTimeRef.current = t;
        console.log('[useRecordingSession] RAF loop first run, statusRef.current:', statusRef.current);
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
  }, [BAR_COUNT, SAMPLE_INTERVAL, drawBars]);

  const cleanupRAF = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);
  
  const cleanupTimelineAnimation = useCallback(() => {
    if (timelineAnimationRef.current) {
      cancelAnimationFrame(timelineAnimationRef.current);
      timelineAnimationRef.current = null;
    }
    timelineAnimationStartRef.current = 0;
  }, []);
  
  const animateTimelineDraw = useCallback((duration = 500) => {
    cleanupTimelineAnimation();
    
    const animate = (currentTime: number) => {
      if (timelineAnimationStartRef.current === 0) {
        timelineAnimationStartRef.current = currentTime;
      }
      
      const elapsed = currentTime - timelineAnimationStartRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutCubic 이징 함수 적용
      const eased = 1 - Math.pow(1 - progress, 3);
      
      drawFullTimeline(eased);
      
      if (progress < 1) {
        timelineAnimationRef.current = requestAnimationFrame(animate);
      } else {
        cleanupTimelineAnimation();
      }
    };
    
    timelineAnimationRef.current = requestAnimationFrame(animate);
  }, [cleanupTimelineAnimation, drawFullTimeline]);

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
    setError(null); // 에러 상태 초기화

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
    } catch (err) {
      // 사용자가 권한을 거부했거나 마이크가 없는 경우
      const errorMessage =
        err instanceof Error
          ? err.message
          : "마이크 접근 권한을 얻을 수 없습니다.";
      console.error("[useRecordingSession] getUserMedia failed:", err);
      setError(errorMessage);
      // streamRef.current는 할당하지 않고, status는 idle로 유지
      return;
    }

    // WebAudio analyser
    const audioContext = new AudioContext();
    console.log('[useRecordingSession] AudioContext initial state:', audioContext.state);
    
    // iOS에서 AudioContext가 suspended 상태로 시작되므로 resume 필요
    if (audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
        console.log('[useRecordingSession] AudioContext resumed, new state:', audioContext.state);
      } catch (err) {
        console.error('[useRecordingSession] Failed to resume AudioContext:', err);
      }
    }
    
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.1;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    
    console.log('[useRecordingSession] Audio visualization setup complete');

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

    statusRef.current = "recording"; // RAF loop에서 즉시 참조 가능
    setStatus("recording");

    cleanupRAF();
    animationRef.current = requestAnimationFrame((t) => loopRef.current?.(t));
    console.log('[useRecordingSession] RAF started, statusRef.current:', statusRef.current);
  }, [BAR_COUNT, cleanupRAF, status]);

  const pause = useCallback(() => {
    if (status !== "recording") return;

    // recording pause
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
    }

    statusRef.current = "paused";
    setStatus("paused");
    cleanupRAF();
    // stream/context 유지, canvas 유지
  }, [cleanupRAF, status]);

  const resume = useCallback(() => {
    if (status !== "paused") return;

    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
    }

    statusRef.current = "recording";
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

    // 전체 파형 애니메이션으로 렌더
    animateTimelineDraw(500);

    statusRef.current = "stopped";
    setStatus("stopped");
  }, [animateTimelineDraw, cleanupRAF, status]);

  const reset = useCallback(() => {
    // 진행중이면 정리
    cleanupRAF();
    cleanupTimelineAnimation();

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
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    setAudioBlob(null);
    statusRef.current = "idle";
    setStatus("idle");
  }, [cleanupMedia, cleanupRAF, cleanupTimelineAnimation]);

  // unmount cleanup
  useEffect(() => {
    return () => {
      cleanupRAF();
      cleanupTimelineAnimation();
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
  }, [cleanupMedia, cleanupRAF, cleanupTimelineAnimation]);

  return {
    canvasRef,
    status, // idle|recording|paused|stopped
    audioBlob, // stop 후 확정
    error, // 마이크 접근 등의 에러 메시지
    start,
    pause,
    resume,
    stop,
    reset,
    updatePlaybackProgress,
  };
}
