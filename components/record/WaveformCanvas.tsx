"use client";

import { memo, useEffect, type RefObject } from "react";

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

function WaveformCanvas({ canvasRef }: Props) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastWidth = 0;
    let lastHeight = 0;

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      const newWidth = Math.round(rect.width * dpr);
      const newHeight = Math.round(rect.height * dpr);

      // 크기가 실제로 변경된 경우에만 재설정
      if (newWidth === lastWidth && newHeight === lastHeight) {
        return;
      }

      lastWidth = newWidth;
      lastHeight = newHeight;

      // 내부 버퍼를 "현재 표시 크기"에 맞춤
      canvas.width = newWidth;
      canvas.height = newHeight;

      // 변환 누적 방지 (매번 리셋)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncSize();

    // iOS Safari 레이아웃 변동(주소창 등)에도 대응
    const ro = new ResizeObserver(() => syncSize());
    ro.observe(canvas);

    return () => {
      ro.disconnect();
    };
  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full block h-20"
      style={{ touchAction: "none" }}
    />
  );
}

export default memo(WaveformCanvas);
