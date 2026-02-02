"use client";

import { useSearchParams } from "next/navigation";
import { useGetLetterData } from "@/hooks/apis/get/useGetLetterData";
import { LetterEditor } from "./LetterEditor";
import { VoicePlayer } from "./VoicePlayer";

export function LetterEditContainer() {
  const searchParams = useSearchParams();
  const letterId = searchParams.get("letterId");
  const { data } = useGetLetterData(letterId);

  if (!data) return null;

  return (
    <section className="flex flex-col p-5 gap-4">
      <LetterEditor initialContent={data.content} />
      <VoicePlayer audioUrl={data.voiceUrl} />
    </section>
  );
}
