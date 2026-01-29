"use client";

import { memo } from "react";

type Props = {
  timeInSeconds: number | null;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

function RecordingTimer({ timeInSeconds }: Props) {
  // idle 상태에서는 공간은 차지하되 보이지 않도록
  const isVisible = timeInSeconds !== null;

  return (
    <div
      className="text-sm text-gray-900 typo-h2-base min-w-14 text-right"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {isVisible ? formatTime(timeInSeconds) : "00:00"}
    </div>
  );
}

export default memo(RecordingTimer);
