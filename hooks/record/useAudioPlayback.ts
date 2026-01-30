"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PlaybackStatus } from "@/types/recording";

export function useAudioPlayback(
  audioBlob: Blob | null,
  onProgressUpdate?: (progress: number) => void,
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // DERIVED (no state): blob -> objectURL
  const audioUrl = useMemo(() => {
    if (!audioBlob) return null;
    return URL.createObjectURL(audioBlob);
  }, [audioBlob]);

  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // cleanup previous audio instance
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    // when there's no blob/url, nothing to wire
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration || 0);
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
      // 재생 종료 시 진행률 초기화
      if (onProgressUpdate) {
        onProgressUpdate(0);
      }
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);

    // cleanup external resources
    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;

      // revoke the object URL created from this blob
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl, onProgressUpdate]);

  const play = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;

    try {
      await a.play();
      setStatus("playing");
    } catch (error) {
      console.error("Playback failed", error);
    }
  }, []);

  const pause = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    setStatus("paused");
  }, []);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setCurrentTime(0);
    setStatus("idle");

    // 재생 중지 시 진행률 초기화
    if (onProgressUpdate) {
      onProgressUpdate(0);
    }
  }, [onProgressUpdate]);

  const seek = useCallback(
    (time: number) => {
      const a = audioRef.current;
      if (!a) return;
      const next = Math.max(0, Math.min(time, duration || 0));
      a.currentTime = next;
      setCurrentTime(next);
    },
    [duration],
  );

  // If blob is null, expose "idle" outputs without resetting in an effect
  const effectiveStatus: PlaybackStatus = audioBlob ? status : "idle";
  const effectiveDuration = audioBlob ? duration : 0;
  const effectiveCurrentTime = audioBlob ? currentTime : 0;

  return {
    status: effectiveStatus,
    audioUrl, // derived
    duration: effectiveDuration,
    currentTime: effectiveCurrentTime,
    play,
    pause,
    stop,
    seek,
  };
}
