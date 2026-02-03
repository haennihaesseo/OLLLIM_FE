"use client";

import { RotateCcw, Play, Pause } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAudioPlayer } from "@/hooks/common/useAudioPlayer";

type AudioPlayerProps = {
  voiceUrl: string;
  duration: number;
};

export default function AudioPlayer({ voiceUrl, duration }: AudioPlayerProps) {
  // 범용 오디오 플레이어 훅 사용
  const {
    status,
    currentTime,
    progress,
    duration: actualDuration,
    togglePlayPause,
    stop,
    seek,
  } = useAudioPlayer({
    audioUrl: voiceUrl,
    initialDuration: duration,
  });

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
    const newTime = percentage * actualDuration;
    seek(newTime);
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3 w-full">
        {/* Progress Bar */}
        <div
          className="flex-1 cursor-pointer relative"
          onClick={handleProgressClick}
          role="slider"
          aria-label="재생 위치 조절"
          aria-valuemin={0}
          aria-valuemax={actualDuration}
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
          {formatTime(currentTime)}
        </span>
      </section>
    </section>
  );
}
