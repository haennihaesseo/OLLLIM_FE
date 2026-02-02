"use client";

import { useSearchParams } from "next/navigation";
import { useGetLetterVoice } from "@/hooks/apis/get/useGetLetterVoice";
import FontCards from "@/components/analyze/FontCards";
import ReanalyzeButton from "@/components/analyze/ReanalyzeButton";
import CompleteButtonContainer from "@/components/analyze/CompleteButtonContainer";

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const letterId = searchParams.get("letterId");

  const { data, isLoading } = useGetLetterVoice(letterId);
  if (isLoading || !data) return null;

  return (
    <article className="flex flex-col items-center justify-center h-full px-5">
      <h2 className="text-gray-400 text-center typo-h2-lg">목소리 분석 결과</h2>
      <section className="flex flex-col items-center justify-center py-7 gap-3">
        <h3 className="text-gray-800 text-center typo-h2-2xl">
          당신의 목소리는
          <br />
          {data.result}
        </h3>
        <FontCards cards={data.fonts} />
      </section>
      <ReanalyzeButton />
      <CompleteButtonContainer />
    </article>
  );
}
