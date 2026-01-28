'use client';

import { useEffect, type RefObject } from 'react';

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export default function WaveformCanvas({ canvasRef }: Props) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 실제 표시 크기 가져오기
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Canvas 내부 해상도를 devicePixelRatio에 맞춰 설정
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    console.log('[WaveformCanvas] Canvas initialized:', {
      displaySize: { width: rect.width, height: rect.height },
      internalSize: { width: canvas.width, height: canvas.height },
      devicePixelRatio: dpr,
    });

    // Canvas context의 스케일 조정
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // 리사이즈 핸들러
    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect();
      const newDpr = window.devicePixelRatio || 1;
      
      canvas.width = newRect.width * newDpr;
      canvas.height = newRect.height * newDpr;
      
      const newCtx = canvas.getContext('2d');
      if (newCtx) {
        newCtx.scale(newDpr, newDpr);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full block h-20"
      style={{ touchAction: 'none' }}
    />
  );
}
