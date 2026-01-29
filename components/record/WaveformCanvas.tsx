"use client";

import { useEffect, type RefObject } from "react";

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export default function WaveformCanvas({ canvasRef }: Props) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // 내부 버퍼를 "현재 표시 크기"에 맞춤
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

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
