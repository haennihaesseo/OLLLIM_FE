"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PlaybackStatus } from "@/types/recording";

type UseAudioPlayerParams = {
  audioUrl: string | null;
  initialDuration?: number;
  onProgressUpdate?: (progress: number) => void;
};

type UseAudioPlayerReturn = {
  status: PlaybackStatus;
  duration: number;
  currentTime: number;
  progress: number; // 0-100
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  togglePlayPause: () => Promise<void>;
};

/**
 * URL 기반 오디오 플레이어 훅
 * @param audioUrl 오디오 파일 URL
 * @param initialDuration 초기 duration (선택적, 메타데이터 로드 전 사용)
 * @param onProgressUpdate 재생 진행률 업데이트 콜백
 */
export function useAudioPlayer({
  audioUrl,
  initialDuration = 0,
  onProgressUpdate,
}: UseAudioPlayerParams): UseAudioPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [duration, setDuration] = useState(initialDuration);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // cleanup previous audio instance
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    // when there's no url, nothing to wire
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const onLoaded = () => {
      const audioDuration = audio.duration;
      // duration이 유효한 값인지 확인 (Infinity, NaN 방지)
      if (audioDuration && isFinite(audioDuration) && !isNaN(audioDuration)) {
        setDuration(audioDuration);
      } else if (initialDuration > 0) {
        setDuration(initialDuration);
      }
    };

    const onTime = () => {
      const currentTime = audio.currentTime || 0;
      setCurrentTime(currentTime);

      // 재생 진행률 업데이트 콜백 호출
      if (onProgressUpdate && audio.duration > 0) {
        const progress = currentTime / audio.duration;
        onProgressUpdate(progress);
      }
    };
    const onEnded = () => {
      setStatus("idle");
      setCurrentTime(0);
      // 재생 종료 시 진행률 초기화
      if (onProgressUpdate) {
        onProgressUpdate(0);
      }
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [audioUrl, initialDuration, onProgressUpdate]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setStatus("playing");
    } catch (error) {
      console.error("재생 실패:", error);
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setStatus("paused");
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setStatus("idle");

    // 재생 중지 시 진행률 초기화
    if (onProgressUpdate) {
      onProgressUpdate(0);
    }
  }, [onProgressUpdate]);

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const next = Math.max(0, Math.min(time, duration || 0));
      audio.currentTime = next;
      setCurrentTime(next);
    },
    [duration],
  );

  const togglePlayPause = useCallback(async () => {
    if (status === "playing") {
      pause();
    } else {
      await play();
    }
  }, [status, play, pause]);

  // If audioUrl is null, expose "idle" outputs
  const effectiveStatus: PlaybackStatus = audioUrl ? status : "idle";
  const effectiveDuration = audioUrl ? duration : 0;
  const effectiveCurrentTime = audioUrl ? currentTime : 0;
  const progress =
    effectiveDuration > 0
      ? (effectiveCurrentTime / effectiveDuration) * 100
      : 0;

  return {
    status: effectiveStatus,
    duration: effectiveDuration,
    currentTime: effectiveCurrentTime,
    progress,
    play,
    pause,
    stop,
    seek,
    togglePlayPause,
  };
}
