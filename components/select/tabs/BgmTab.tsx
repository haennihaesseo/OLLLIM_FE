"use client";

import { useMemo } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";
import { useGetLetterBgm } from "@/hooks/apis/get/useGetLetterBgm";
import { useBgmPlayer } from "@/hooks/common/useBgmPlayer";
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

  // 배경음 없음 옵션을 포함한 BGM 목록
  const bgmList = useMemo(() => {
    if (!data?.bgms) return [];

    const noBgmOption: BgmInfo = {
      bgmId: -1, // 특별한 ID로 구분
      name: "배경음 없음",
      bgmUrl: "",
      keyword: [],
    };

    return [noBgmOption, ...data.bgms];
  }, [data]);

  // 선택된 BGM의 URL 계산
  const currentBgmUrl = useMemo(() => {
    if (!selectedBgm || selectedBgm === "none" || !data?.bgms) return null;

    const currentBgm = data.bgms.find(
      (bgm) => String(bgm.bgmId) === selectedBgm,
    );
    return currentBgm?.bgmUrl || null;
  }, [selectedBgm, data]);

  // BGM 플레이어 훅 사용
  useBgmPlayer({
    bgmUrl: currentBgmUrl,
    volume,
    autoPlay: true,
  });

  const renderBgmItem = (bgm: BgmInfo) => {
    // "배경음 없음" 옵션은 value를 "none"으로 설정
    const bgmIdStr = bgm.bgmId === -1 ? "none" : String(bgm.bgmId);

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
        <Slider
          value={[volume]}
          onValueChange={(value) => onVolumeChange(value[0])}
          max={100}
          step={1}
          className="flex-1 **:data-[slot=slider-track]:h-[2px] **:data-[slot=slider-track]:bg-gray-400 **:data-[slot=slider-range]:bg-gray-700 **:data-[slot=slider-thumb]:w-3 **:data-[slot=slider-thumb]:h-3 **:data-[slot=slider-thumb]:rounded-xs **:data-[slot=slider-thumb]:border-0 **:data-[slot=slider-thumb]:bg-gray-700 **:data-[slot=slider-thumb]:shadow-none **:data-[slot=slider-thumb]:hover:ring-0 **:data-[slot=slider-thumb]:focus-visible:ring-0"
        />
        <Volume2 size={20} className="text-gray-600 shrink-0" />
      </div>

      <RadioGroup value={selectedBgm} onValueChange={onBgmChange}>
        <div className="space-y-0">{bgmList.map(renderBgmItem)}</div>
      </RadioGroup>
    </div>
  );
}
