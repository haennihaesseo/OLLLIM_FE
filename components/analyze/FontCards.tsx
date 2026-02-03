"use client";

import { Card, CardContent } from "../ui/card";
import type { FontInfo } from "@/types/letter";
import { useDynamicFonts } from "@/hooks/common/useDynamicFont";

interface FontCardsProps {
  cards: FontInfo[];
  selectedFontId?: number;
  onSelectFont?: (fontId: number) => void;
}

export default function FontCards({
  cards,
  selectedFontId,
  onSelectFont,
}: FontCardsProps) {
  const fontFamilyMap = useDynamicFonts(cards);

  return (
    <div className="flex items-center gap-2 w-full h-25">
      {cards.map((card) => {
        const isSelected = selectedFontId === card.fontId;
        return (
          <Card
            key={card.fontId}
            onClick={() => onSelectFont?.(card.fontId)}
            className={`h-25 flex-1 justify-center transition-all cursor-pointer border-2 ${
              isSelected
                ? "bg-[#E6002314] border-primary-700 "
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <CardContent className="flex items-center justify-center w-full px-0">
              <div
                style={{ fontFamily: fontFamilyMap.get(card.fontId) }}
                className={`text-center wrap-break-words w-full text-gray-800`}
              >
                {card.name}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
