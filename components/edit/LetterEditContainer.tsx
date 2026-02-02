"use client";

import { useSearchParams } from "next/navigation";
import { useGetLetterData } from "@/hooks/apis/get/useGetLetterData";
import { LetterEditor } from "./LetterEditor";
import { VoicePlayer } from "./VoicePlayer";

export function LetterEditContainer() {
  const searchParams = useSearchParams();
  const letterId = searchParams.get("letterId");
  const { data, isLoading, error } = useGetLetterData(letterId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600">데이터를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col p-5 gap-4">
      <LetterEditor />
      <VoicePlayer audioUrl={data.voiceUrl} />
    </section>
  );
}
