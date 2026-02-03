"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Volume2, VolumeX } from "lucide-react";
import { useGetLetterBgm } from "@/hooks/apis/get/useGetLetterBgm";
import type { BgmInfo } from "@/types/letter";

interface BgmTabProps {
  selectedBgm: string;
  onBgmChange: (value: string) => void;
  volume: number;
  onVolumeChange: (value: number) => void;
}

export default function BgmTab({
  selectedBgm,
  onBgmChange,
  volume,
  onVolumeChange,
}: BgmTabProps) {
  const { data } = useGetLetterBgm();

  if (!data) {
    return null;
  }

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    onVolumeChange(Math.max(0, Math.min(100, percentage)));
  };

  const renderBgmItem = (bgm: BgmInfo) => {
    const bgmIdStr = String(bgm.bgmId);
    return (
      <div key={bgm.bgmId} className="flex items-center justify-between py-2.5">
        <div className="flex items-center gap-3">
          <Label htmlFor={bgmIdStr} className="cursor-pointer">
            <div className="flex flex-col gap-2">
              {bgm.keyword && bgm.keyword.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {bgm.keyword.map((keyword, index) => (
                    <span
                      key={index}
                      className="text-xs px-1.5 py-0.5 bg-gray-100 rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-lg font-medium">{bgm.name}</div>
            </div>
          </Label>
        </div>
        <RadioGroupItem value={bgmIdStr} id={bgmIdStr} />
      </div>
    );
  };

  return (
    <div className="px-4 py-4">
      {/* 볼륨 조절 바 */}
      <div className="flex items-center gap-3 mb-6">
        <VolumeX size={20} className="text-gray-600 shrink-0" />
        <div
          className="flex-1 cursor-pointer relative"
          onClick={handleVolumeClick}
          role="slider"
          aria-label="볼륨 조절"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={volume}
        >
          <Progress
            value={volume}
            className="h-[2px] bg-gray-400"
            indicatorClassName="bg-gray-700"
          />
          {/* 볼륨 Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-xs pointer-events-none transition-all duration-100"
            style={{ left: `calc(${volume}% - 6px)` }}
          />
        </div>
        <Volume2 size={20} className="text-gray-600 shrink-0" />
      </div>

      <RadioGroup value={selectedBgm} onValueChange={onBgmChange}>
        <div className="space-y-0">{data.bgms.map(renderBgmItem)}</div>
      </RadioGroup>
    </div>
  );
}
