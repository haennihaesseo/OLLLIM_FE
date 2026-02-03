"use client";

import { useCallback, useEffect, useRef } from "react";

type UseBgmPlayerParams = {
  bgmUrl: string | null;
  volume: number; // 0-100
  autoPlay?: boolean;
};

type UseBgmPlayerReturn = {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
};

/**
 * BGM 전용 오디오 플레이어 훅
 * @param bgmUrl BGM 파일 URL
 * @param volume 볼륨 (0-100)
 * @param autoPlay 자동 재생 여부 (기본값: true)
 */
export function useBgmPlayer({
  bgmUrl,
  volume,
  autoPlay = true,
}: UseBgmPlayerParams): UseBgmPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // BGM URL 변경 시 오디오 초기화 및 재생
  useEffect(() => {
    // 이전 오디오 정리
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    // URL이 없으면 종료
    if (!bgmUrl) return;

    // 새 오디오 생성
    const audio = new Audio(bgmUrl);
    audio.crossOrigin = "anonymous";
    audio.loop = true; // BGM은 항상 반복 재생
    audio.volume = volume / 100;

    audioRef.current = audio;

    // 자동 재생
    if (autoPlay) {
      audio.play().catch((error) => {
        console.warn("BGM 자동 재생이 차단되었습니다:", error);
      });
    }

    // cleanup
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [bgmUrl, volume, autoPlay]);

  // 볼륨 변경 시 적용
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
    } catch (error) {
      console.error("BGM 재생 실패:", error);
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  return {
    play,
    pause,
    stop,
  };
}
