"use client";

import Image from "next/image";

interface FloatingButtonProps {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-[30%] right-10 lg:right-[40%] lg:bottom-[50%] w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 transition-colors flex items-center justify-center z-50"
      aria-label="편집 옵션 열기"
    >
      <Image
        src="/gif/edit_motion.gif"
        alt="편집"
        width={30}
        height={30}
        className="w-8 h-8"
        unoptimized
      />
    </button>
  );
}
