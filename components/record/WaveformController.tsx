"use client";

import React from "react";
import { RotateCcw, Play } from "lucide-react";
import type { ControlPreset } from "@/hooks/record/useWaveformControllerPreset";

function IconButton({ preset }: { preset: ControlPreset }) {
  const { variant, ariaLabel, size = "md", onClick, disabled } = preset;

  // disabled 상태일 때는 아무것도 렌더링하지 않음
  if (variant === "disabled") {
    return <div className="w-16 h-16" />;
  }

  const base =
    "relative flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed";
  const dims = "w-16 h-16";

  const ring =
    size === "md"
      ? "absolute w-[3.5rem] h-[3.5rem] rounded-full border-2 border-gray-300"
      : "absolute w-[3rem] h-[3rem] rounded-full border-2 border-gray-300";

  const inner = (() => {
    switch (variant) {
      case "record":
        return (
          <div
            className={
              size === "md"
                ? "w-12 h-12 rounded-full bg-red-600"
                : "w-10 h-10 rounded-full bg-red-600"
            }
          />
        );
      case "stop":
        return (
          <div
            className={
              size === "md"
                ? "w-7.5 h-7.5 bg-red-600 rounded-sm"
                : "w-5.5 h-5.5 bg-red-600 rounded-sm"
            }
          />
        );
      case "pause":
        return (
          <div className="flex items-center gap-1">
            <div
              className={
                size === "md"
                  ? "w-3 h-7.5 bg-gray-600 rounded-sm"
                  : "w-2.25 h-5.5 bg-gray-600 rounded-sm"
              }
            />
            <div
              className={
                size === "md"
                  ? "w-3 h-7.5 bg-gray-600 rounded-sm"
                  : "w-2.25 h-5.5 bg-gray-600 rounded-sm"
              }
            />
          </div>
        );
      case "reset":
        return (
          <RotateCcw
            size={size === "md" ? 28 : 24}
            className="text-gray-600"
            aria-hidden="true"
          />
        );
      case "play":
        return (
          <Play
            size={size === "md" ? 28 : 24}
            className="text-primary-700"
            fill="currentColor"
            aria-hidden="true"
          />
        );

      default:
        return null;
    }
  })();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${base} ${dims}`}
    >
      <div className={ring} />
      {inner}
    </button>
  );
}

export default function WaveformController({
  preset,
}: {
  preset: {
    message: React.ReactNode;
    left: ControlPreset;
    main: ControlPreset;
    right: ControlPreset;
  };
}) {
  return (
    <section className="flex flex-col items-center gap-2 w-full py-[0.62rem]">
      <div className="flex w-full justify-between items-center px-2.5">
        <IconButton preset={preset.left} />
        <IconButton preset={preset.main} />
        <IconButton preset={preset.right} />
      </div>
      <p className="typo-h2-base text-gray-900 text-center">{preset.message}</p>
    </section>
  );
}
