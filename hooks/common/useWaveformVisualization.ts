"use client";

import { useCallback, useRef, type RefObject } from "react";

type UseWaveformVisualizationParams = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  barCount?: number;
  gap?: number;
};

export function useWaveformVisualization({
  canvasRef,
  barCount = 70,
  gap = 3,
}: UseWaveformVisualizationParams) {
  // Playback progress for canvas visualization
  const playbackProgressRef = useRef(0);

  /**
   * waveform 바를 캔버스에 그립니다
   * @param levels 0~1 사이의 레벨 값 배열
   * @param playbackProgress 재생 진행률 (0~1)
   */
  const drawBars = useCallback(
    (levels: number[], playbackProgress = 0) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      // Canvas의 실제 표시 크기 사용 (devicePixelRatio 고려)
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;
      const count = levels.length;

      if (count === 0) {
        return;
      }

      const barWidth = Math.max(2, (width - gap * (count - 1)) / count);

      // Canvas의 내부 해상도로 clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < count; i++) {
        const level = levels[i]; // 0~1
        const barHeight = level * (height * 0.9);
        const x = i * (barWidth + gap);
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
    [canvasRef, gap],
  );

  /**
   * 전체 타임라인을 요약하여 그립니다
   * @param fullLevels 전체 레벨 배열
   * @param visibleRatio 표시할 비율 (0~1, 애니메이션용)
   */
  const drawFullTimeline = useCallback(
    (fullLevels: number[], visibleRatio = 1) => {
      if (fullLevels.length === 0) {
        return;
      }

      const bucketCount = barCount;
      const step = Math.max(1, Math.floor(fullLevels.length / bucketCount));
      const summarized: number[] = [];

      for (let i = 0; i < bucketCount; i++) {
        const start = i * step;
        const end = Math.min(fullLevels.length, start + step);
        let max = 0;
        for (let j = start; j < end; j++) {
          if (fullLevels[j] > max) max = fullLevels[j];
        }
        summarized.push(max);
      }

      // 애니메이션: visibleRatio만큼만 표시
      const visibleCount = Math.ceil(summarized.length * visibleRatio);
      const visibleBars = summarized.slice(0, visibleCount);

      drawBars(visibleBars, playbackProgressRef.current);
    },
    [barCount, drawBars],
  );

  /**
   * 재생 진행률을 업데이트하고 다시 그립니다
   * @param progress 재생 진행률 (0~1)
   * @param fullLevels 전체 레벨 배열
   */
  const updatePlaybackProgress = useCallback(
    (progress: number, fullLevels: number[]) => {
      playbackProgressRef.current = progress;
      drawFullTimeline(fullLevels);
    },
    [drawFullTimeline],
  );

  /**
   * 캔버스를 초기화합니다
   */
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  return {
    drawBars,
    drawFullTimeline,
    updatePlaybackProgress,
    clearCanvas,
  };
}
