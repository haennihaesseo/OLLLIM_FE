'use client';

import type { RefObject } from 'react';

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export default function WaveformCanvas({ canvasRef }: Props) {
  return (
    <canvas
      ref={canvasRef}
      width={350}
      height={80}
      className="w-full block"
    />
  );
}
