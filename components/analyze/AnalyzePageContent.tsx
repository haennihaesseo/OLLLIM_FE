"use client";

import { useState } from "react";
import { useSuspenseLetterVoice } from "@/hooks/apis/get/useGetLetterVoice";
import { useSuspenseLetterFont } from "@/hooks/apis/get/useGetLetterFont";
import FontCards from "@/components/analyze/FontCards";
import CompleteButtonContainer from "@/components/analyze/CompleteButtonContainer";
import ReanalyzeButtonContainer from "@/components/analyze/ReanalyzeButtonContainer";

export default function AnalyzePageContent() {
  const { data: voiceData } = useSuspenseLetterVoice();
  const { data: fontData } = useSuspenseLetterFont("VOICE");
  const [selectedFontId, setSelectedFontId] = useState<number | undefined>(
    undefined
  );

  return (
    <article className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <h2 className="text-gray-400 text-center typo-h2-lg">
          목소리 분석 결과
        </h2>
        <section className="flex flex-col items-center justify-center py-7 gap-3">
          <h3 className="text-gray-800 text-center typo-h2-2xl">
            당신의 목소리는
            <br />
            {voiceData.result}
          </h3>
          <FontCards
            cards={fontData.fonts}
            selectedFontId={selectedFontId}
            onSelectFont={setSelectedFontId}
          />
        </section>
        <ReanalyzeButtonContainer
          onReanalyze={() => setSelectedFontId(undefined)}
        />
      </div>
      <CompleteButtonContainer selectedFontId={selectedFontId} />
    </article>
  );
}
