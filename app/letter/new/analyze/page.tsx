"use client";

import { useGetLetterVoice } from "@/hooks/apis/get/useGetLetterVoice";
import { useGetLetterFont } from "@/hooks/apis/get/useGetLetterFont";
import FontCards from "@/components/analyze/FontCards";
import CompleteButtonContainer from "@/components/analyze/CompleteButtonContainer";
import ReanalyzeButtonContainer from "@/components/analyze/ReanalyzeButtonContainer";

export default function AnalyzePage() {
  const { data: voiceData, isSuccess: isVoiceSuccess } = useGetLetterVoice();
  const { data: fontData, isLoading: isFontLoading } = useGetLetterFont(
    isVoiceSuccess
  );

  if (isFontLoading || !voiceData || !fontData) return null;

  return (
    <article className="flex flex-col items-center justify-center h-full px-5">
      <h2 className="text-gray-400 text-center typo-h2-lg">목소리 분석 결과</h2>
      <section className="flex flex-col items-center justify-center py-7 gap-3">
        <h3 className="text-gray-800 text-center typo-h2-2xl">
          당신의 목소리는
          <br />
          {voiceData.result}
        </h3>
        <FontCards cards={fontData.voiceFonts} />
      </section>
      <ReanalyzeButtonContainer />
      <CompleteButtonContainer />
    </article>
  );
}
