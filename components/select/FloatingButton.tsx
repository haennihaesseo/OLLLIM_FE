"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Music, Palette, Type } from "lucide-react";

interface FloatingButtonProps {
  onOptionClick: (option: "bgm" | "paper" | "font") => void;
}

export default function FloatingButton({ onOptionClick }: FloatingButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // 3초 후 툴팁 숨김
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleMainButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionClick = (option: "bgm" | "paper" | "font") => {
    setIsExpanded(false);
    onOptionClick(option);
  };

  const options = [
    {
      id: "bgm" as const,
      icon: Music,
      label: "배경음",
    },
    {
      id: "paper" as const,
      icon: Palette,
      label: "편지지",
    },
    {
      id: "font" as const,
      icon: Type,
      label: "폰트",
    },
  ];

  return (
    <div className="fixed top-[500px] left-10 lg:left-[40%] z-50">
      {/* 확장된 옵션 버튼들 */}
      {isExpanded && (
        <div className="absolute bottom-16 left-0 flex flex-col gap-3 mb-2">
          {options.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={`w-12 h-12 rounded-full bg-[#E6002314] border-2 border-primary-700 flex items-center justify-center text-primary-700 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-4`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                aria-label={option.label}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          })}
        </div>
      )}

      {/* 메인 버튼 */}
      <div className="relative">
        {/* 툴팁 */}
        {showTooltip && (
          <div
            className="absolute left-14 top-1/2 -translate-y-1/2 typo-h2-base whitespace-nowrap animate-in fade-in slide-in-from-left-2"
            style={{
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            탭하여 꾸미기
          </div>
        )}

        {/* 버튼 */}
        <button
          onClick={handleMainButtonClick}
          className={`w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 transition-all duration-300 flex items-center justify-center ${
            isExpanded ? "rotate-45" : ""
          }`}
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
      </div>
    </div>
  );
}
