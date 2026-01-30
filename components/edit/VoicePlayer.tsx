"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import WaveformCanvas from "@/components/record/WaveformCanvas";
import RecordingTimer from "@/components/record/RecordingTimer";
import { useWaveformVisualization } from "@/hooks/common/useWaveformVisualization";
import { useAudioWaveformAnalysis } from "@/hooks/common/useAudioWaveformAnalysis";

type VoicePlayerProps = {
  audioUrl: string;
};

export function VoicePlayer({ audioUrl }: VoicePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const levelsRef = useRef<number[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // 오디오 분석하여 waveform levels 생성
  const { levels, duration: analyzedDuration } =
    useAudioWaveformAnalysis(audioUrl);

  // Waveform 시각화
  const { drawFullTimeline, updatePlaybackProgress } = useWaveformVisualization(
    {
      canvasRef,
    },
  );

  // levels를 ref에 미러링
  useEffect(() => {
    levelsRef.current = levels;
  }, [levels]);

  // 오디오 엘리먼트 초기화
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.crossOrigin = "anonymous"; // CORS 설정
    audioRef.current = audio;

    const onLoadedMetadata = () => {
      // Duration은 analyzedDuration으로 충분
    };

    const onTimeUpdate = () => {
      const current = audio.currentTime || 0;
      setCurrentTime(current);

      // 재생 진행률 업데이트
      if (audio.duration > 0 && levelsRef.current.length > 0) {
        const progress = current / audio.duration;
        updatePlaybackProgress(progress, levelsRef.current);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (levelsRef.current.length > 0) {
        updatePlaybackProgress(0, levelsRef.current);
      }
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [audioUrl, analyzedDuration, updatePlaybackProgress]);

  // Waveform 초기 그리기
  useEffect(() => {
    if (levels.length > 0) {
      drawFullTimeline(levels);
    }
  }, [levels, drawFullTimeline]);

  // Play/Pause 토글
  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // Playback failed
      }
    }
  }, [isPlaying]);

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Play/Pause 버튼 */}
      <button
        type="button"
        onClick={togglePlayPause}
        aria-label={isPlaying ? "일시정지" : "재생"}
        className="relative flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed w-12 h-12 shrink-0"
      >
        <div className="absolute w-11 h-11 rounded-full border-2 border-gray-300" />
        {isPlaying ? (
          <Pause
            size={24}
            className="text-gray-900"
            fill="currentColor"
            aria-hidden="true"
          />
        ) : (
          <Play
            size={24}
            className="text-gray-900"
            fill="currentColor"
            aria-hidden="true"
          />
        )}
      </button>

      {/* Waveform */}
      <div className="flex-1">
        <WaveformCanvas canvasRef={canvasRef} />
      </div>

      {/* Timer */}
      <RecordingTimer timeInSeconds={currentTime} />
    </div>
  );
}
