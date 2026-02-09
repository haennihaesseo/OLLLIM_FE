"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Music, Palette, Type } from "lucide-react";

interface FloatingButtonProps {
  onOptionClick: (option: "bgm" | "paper" | "font") => void;
}

export default function FloatingButton({ onOptionClick }: FloatingButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 애니메이션 스타일 추가
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideUpFade {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes slideTooltip {
        0% {
          opacity: 0;
          transform: translateX(-5px);
        }
        5% {
          opacity: 1;
          transform: translateX(0);
        }
        80% {
          opacity: 1;
          transform: translateX(0);
        }
        85%, 100% {
          opacity: 0;
          transform: translateX(-5px);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
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
    <div className="fixed top-[380px] left-10 lg:left-[40%] z-50">
      {/* 확장된 옵션 버튼들 */}
      {isExpanded && (
        <div className="absolute bottom-15 left-0 flex flex-col gap-2">
          {options.map((option, index) => {
            const Icon = option.icon;
            // 아래것부터 위로 나타나도록 역순 delay 계산
            const reverseIndex = options.length - 1 - index;
            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={`w-12 h-12 rounded-full bg-[#FFF0F2] border-2 border-primary-700 flex items-center justify-center text-primary-700 transition-all will-change-transform`}
                style={{
                  animation:
                    "slideUpFade 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                  animationDelay: `${reverseIndex * 80}ms`,
                  opacity: 0,
                  transform: "translateY(10px)",
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
        {!isExpanded && (
          <div
            className="absolute left-14 top-1/2 -translate-y-1/2 typo-h2-base whitespace-nowrap"
            style={{
              animation: "slideTooltip 4s ease-in-out infinite",
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
