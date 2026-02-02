"use client";

import { Card, CardContent } from "../ui/card";
import type { FontInfo } from "@/types/letter";
import { useDynamicFonts } from "@/hooks/common/useDynamicFont";

export default function FontCards({ cards }: { cards: FontInfo[] }) {
  const fontFamilyMap = useDynamicFonts(cards);

  return (
    <div className="flex items-center gap-2 w-full h-25">
      {cards.map((card) => (
        <Card key={card.fontId} className="bg-gray-50 border-gray-200 h-25">
          <CardContent className="flex items-center justify-center">
            <div
              style={{ fontFamily: fontFamilyMap.get(card.fontId) }}
              className="text-gray-800 text-center wrap-break-words w-full"
            >
              {card.name}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
