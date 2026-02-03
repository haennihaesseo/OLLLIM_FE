"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useGetLetterFont } from "@/hooks/apis/get/useGetLetterFont";
import { useDynamicFonts } from "@/hooks/common/useDynamicFont";
import type { FontInfo } from "@/types/letter";

interface FontTabProps {
  selectedFont: string;
  onFontChange: (value: string) => void;
}

export default function FontTab({ selectedFont, onFontChange }: FontTabProps) {
  const { data } = useGetLetterFont();

  // 모든 폰트를 하나의 배열로 합침
  const allFonts = [...(data?.voiceFonts || []), ...(data?.contextFonts || [])];
  const fontFamilyMap = useDynamicFonts(allFonts);

  if (!data) {
    return null;
  }

  const renderFontItem = (font: FontInfo) => {
    const fontIdStr = String(font.fontId);
    return (
      <div
        key={font.fontId}
        className="flex items-center justify-between py-2.5"
      >
        <div className="flex items-center gap-3">
          <Label htmlFor={fontIdStr} className="cursor-pointer">
            <div className="flex flex-col gap-2">
              {font.keywords && font.keywords.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {font.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="text-xs px-1.5 py-0.5 bg-gray-100 rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
              <div
                className="text-lg font-medium"
                style={{ fontFamily: fontFamilyMap.get(font.fontId) }}
              >
                {font.name}
              </div>
            </div>
          </Label>
        </div>
        <RadioGroupItem value={fontIdStr} id={fontIdStr} />
      </div>
    );
  };

  return (
    <div className="px-4 py-4">
      <RadioGroup value={selectedFont} onValueChange={onFontChange}>
        {/* 목소리 기반 폰트 */}
        {data.voiceFonts && data.voiceFonts.length > 0 && (
          <div>
            <h3 className="typo-h2-base text-gray-900 mb-2 items-center flex justify-center border-b border-gray-400 pb-2">
              목소리 기반
            </h3>
            <div className="space-y-0">
              {data.voiceFonts.map(renderFontItem)}
            </div>
          </div>
        )}

        {/* 컨텍스트 기반 폰트 */}
        {data.contextFonts && data.contextFonts.length > 0 && (
          <div>
            <h3 className="typo-h2-base text-gray-900 mb-2 items-center flex justify-center border-b border-gray-400 pb-2">
              내용 기반
            </h3>
            <div className="space-y-0">
              {data.contextFonts.map(renderFontItem)}
            </div>
          </div>
        )}
      </RadioGroup>
    </div>
  );
}
