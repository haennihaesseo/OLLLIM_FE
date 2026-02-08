"use client";

import { useEffect, useRef } from "react";
import { RotateCcw, Play, Pause } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { PlaybackStatus } from "@/types/recording";

type AudioPlayerProps = {
  bgmUrl?: string | null;
  bgmSize?: number; // 0-100 사이의 BGM 볼륨 크기
  status: PlaybackStatus;
  currentTime: number;
  progress: number;
  duration: number;
  togglePlayPause: () => Promise<void>;
  stop: () => void;
  seek: (time: number) => void;
};

export default function AudioPlayer({
  bgmUrl,
  bgmSize = 50, // 기본값 50
  status,
  currentTime,
  progress,
  duration,
  togglePlayPause: originalTogglePlayPause,
  stop: originalStop,
  seek: originalSeek,
}: AudioPlayerProps) {
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // BGM 오디오 엘리먼트 생성 및 관리
  useEffect(() => {
    // cleanup previous bgm instance
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.src = "";
      bgmRef.current = null;
    }

    // bgmUrl이 없으면 종료
    if (!bgmUrl) return;

    const bgm = new Audio(bgmUrl);
    bgm.crossOrigin = "anonymous";
    bgm.loop = true; // 반복 재생
    bgm.volume = Math.max(0, Math.min(100, bgmSize)) / 100; // 0-100을 0-1로 변환
    bgmRef.current = bgm;

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.src = "";
        bgmRef.current = null;
      }
    };
  }, [bgmUrl, bgmSize]);

  // voice 재생 상태에 따라 BGM 정지
  useEffect(() => {
    if (!bgmRef.current) return;

    // voice가 끝나면 (status가 idle이 되면) BGM도 정지
    if (status === "idle") {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
  }, [status]);

  // BGM과 동기화된 플레이어 제어 함수들
  const togglePlayPause = async () => {
    const wasPlaying = status === "playing";

    await originalTogglePlayPause();

    if (!bgmRef.current) return;

    if (wasPlaying) {
      // 재생 중이었으면 일시정지
      bgmRef.current.pause();
    } else {
      // 정지 중이었으면 재생
      try {
        await bgmRef.current.play();
      } catch (error) {
        console.error("BGM 재생 실패:", error);
      }
    }
  };

  const stop = () => {
    originalStop();

    if (!bgmRef.current) return;

    bgmRef.current.pause();
    bgmRef.current.currentTime = 0;
  };

  const seek = (time: number) => {
    originalSeek(time);

    if (!bgmRef.current) return;

    // BGM의 재생 위치도 동기화
    const bgmDuration = bgmRef.current.duration;
    if (bgmDuration > 0) {
      // BGM이 loop이므로 전체 길이로 나눈 나머지로 설정
      bgmRef.current.currentTime = time % bgmDuration;
    }
  };

  // 타임 포맷팅 함수 (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const isPlaying = status === "playing";

  // 프로그레스바 클릭 핸들러
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    seek(newTime);
  };

  return (
    <section className="flex flex-col gap-5 px-2">
      <div className="flex items-center gap-3 w-full">
        {/* Progress Bar */}
        <div
          className="flex-1 cursor-pointer relative"
          onClick={handleProgressClick}
          role="slider"
          aria-label="재생 위치 조절"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
        >
          <Progress
            value={progress}
            className="h-[2px] bg-gray-400"
            indicatorClassName="bg-gray-700"
          />
          {/* 재생 위치 네모 Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-xs pointer-events-none transition-all duration-100"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
      </div>
      <section className="relative flex items-center w-full justify-between">
        {/* 리셋 버튼 - 왼쪽 끝 고정 */}
        <button
          type="button"
          onClick={stop}
          aria-label="처음으로"
          className="flex items-center justify-center w-10 h-10 rounded-full transition-colors shrink-0 border border-gray-300 bg-white"
        >
          <RotateCcw size={18} className="text-gray-600" />
        </button>

        {/* 재생/일시정지 버튼 - 중앙 고정 */}
        <button
          type="button"
          onClick={togglePlayPause}
          aria-label={isPlaying ? "일시정지" : "재생"}
          className="flex items-center justify-center w-10 h-10  rounded-full transition-colors shrink-0 border border-gray-300 bg-white"
        >
          {isPlaying ? (
            <Pause size={18} className="text-gray-600" fill="currentColor" />
          ) : (
            <Play
              size={18}
              className="text-gray-900 ml-0.5"
              fill="currentColor"
            />
          )}
        </button>

        {/* 타임스탬프 */}
        <span className="typo-h2-base text-gray-900 min-w-[40px] text-right shrink-0">
          {formatTime(status === "idle" ? duration : currentTime)}
        </span>
      </section>
    </section>
  );
}
