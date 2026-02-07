"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { recordingStatusAtom, audioBlobAtom, recordingTimeAtom } from "@/store/recordingAtoms";
import type { RecordingStatus } from "@/types/recording";
import { useWaveformVisualization } from "@/hooks/common/useWaveformVisualization";
import { computeRMSFromUint8 } from "@/lib/audioUtils";

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

  const [status, setStatus] = useAtom(recordingStatusAtom);
  const statusRef = useRef<RecordingStatus>("idle"); // RAF loop에서 최신 상태 참조용
  const [audioBlob, setAudioBlob] = useAtom(audioBlobAtom);
  const setRecordingTimeAtom = useSetAtom(recordingTimeAtom);
  const [error, setError] = useState<string | null>(null);

  // Recording time tracking
  const [recordingTime, setRecordingTime] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTimeRef = useRef(0);

  // ===== tuning =====
  const BAR_COUNT = 70;
  const GAP = 3;
  const SAMPLE_INTERVAL = 50;

  // Waveform visualization hook
  const {
    drawBars,
    drawFullTimeline,
    updatePlaybackProgress: updatePlaybackProgressBase,
    clearCanvas,
  } = useWaveformVisualization({ canvasRef, barCount: BAR_COUNT, gap: GAP });

  // updatePlaybackProgress를 래핑하여 fullLevelsRef를 자동으로 전달
  const updatePlaybackProgress = useCallback(
    (progress: number) => {
      updatePlaybackProgressBase(progress, fullLevelsRef.current);
    },
    [updatePlaybackProgressBase],
  );

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
        // 첫 실행은 샘플링하지 않고 다음 RAF로 진행
      } else if (t - lastSampleTimeRef.current >= SAMPLE_INTERVAL) {
        lastSampleTimeRef.current = t;

        const rms = computeRMSFromUint8(dataArray);
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
        loopRef.current?.(time),
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

  const cleanupTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    cleanupTimer();
    recordingStartTimeRef.current = Date.now() - recordingTime * 1000;

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - recordingStartTimeRef.current;
      setRecordingTime(Math.floor(elapsed / 1000));
    }, 1000);
  }, [cleanupTimer, recordingTime]);

  const animateTimelineDraw = useCallback(
    (duration = 500) => {
      cleanupTimelineAnimation();

      const animate = (currentTime: number) => {
        if (timelineAnimationStartRef.current === 0) {
          timelineAnimationStartRef.current = currentTime;
        }

        const elapsed = currentTime - timelineAnimationStartRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutCubic 이징 함수 적용
        const eased = 1 - Math.pow(1 - progress, 3);

        drawFullTimeline(fullLevelsRef.current, eased);

        if (progress < 1) {
          timelineAnimationRef.current = requestAnimationFrame(animate);
        } else {
          cleanupTimelineAnimation();
        }
      };

      timelineAnimationRef.current = requestAnimationFrame(animate);
    },
    [cleanupTimelineAnimation, drawFullTimeline],
  );

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
    setRecordingTime(0); // 녹음 시간 초기화
    setRecordingTimeAtom(0); // atom도 초기화

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
      setError(errorMessage);
      // streamRef.current는 할당하지 않고, status는 idle로 유지
      return;
    }

    // WebAudio analyser
    const audioContext = new AudioContext();

    // iOS에서 AudioContext가 suspended 상태로 시작되므로 resume 필요
    if (audioContext.state === "suspended") {
      try {
        await audioContext.resume();
      } catch {
        // ignore
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

    // MediaRecorder (real recording)
    const mimeType = pickSupportedMime();
    mimeTypeRef.current = mimeType;

    const recorder = new MediaRecorder(
      stream,
      mimeType ? { mimeType } : undefined,
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

    // 타이머 시작
    startTimer();
  }, [BAR_COUNT, cleanupRAF, startTimer, status, setStatus, setAudioBlob, setRecordingTimeAtom]);

  const pause = useCallback(() => {
    if (status !== "recording") return;

    // recording pause
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
    }

    statusRef.current = "paused";
    setStatus("paused");
    cleanupRAF();
    cleanupTimer(); // 타이머 정지 (시간은 유지)
    // stream/context 유지, canvas 유지
  }, [cleanupRAF, cleanupTimer, status, setStatus]);

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

    // 타이머 재시작 (이전 시간부터 이어서)
    startTimer();
  }, [cleanupRAF, startTimer, status, setStatus]);

  const stop = useCallback(() => {
    if (status === "idle") return;

    // RAF stop
    cleanupRAF();
    cleanupTimer(); // 타이머 정지 (시간은 유지)

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

    // 녹음 시간을 atom에 저장
    setRecordingTimeAtom(recordingTime);

    // 전체 파형 애니메이션으로 렌더
    animateTimelineDraw(500);

    statusRef.current = "stopped";
    setStatus("stopped");
  }, [animateTimelineDraw, cleanupRAF, cleanupTimer, status, setStatus, setRecordingTimeAtom, recordingTime]);

  const reset = useCallback(() => {
    // 진행중이면 정리
    cleanupRAF();
    cleanupTimelineAnimation();
    cleanupTimer(); // 타이머 정지

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
    clearCanvas();

    setAudioBlob(null);
    setRecordingTime(0); // 녹음 시간 초기화
    setRecordingTimeAtom(0); // atom도 초기화
    statusRef.current = "idle";
    setStatus("idle");
  }, [
    cleanupMedia,
    cleanupRAF,
    cleanupTimelineAnimation,
    cleanupTimer,
    clearCanvas,
    setStatus,
    setAudioBlob,
    setRecordingTimeAtom,
  ]);

  // unmount cleanup
  useEffect(() => {
    return () => {
      cleanupRAF();
      cleanupTimelineAnimation();
      cleanupTimer();
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
  }, [cleanupMedia, cleanupRAF, cleanupTimelineAnimation, cleanupTimer]);

  return {
    canvasRef,
    status, // idle|recording|paused|stopped
    audioBlob, // stop 후 확정
    error, // 마이크 접근 등의 에러 메시지
    recordingTime, // 녹음 시간 (초)
    start,
    pause,
    resume,
    stop,
    reset,
    updatePlaybackProgress,
  };
}
