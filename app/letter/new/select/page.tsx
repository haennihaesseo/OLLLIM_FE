"use client";

import { useGetLetterData } from "@/hooks/apis/get/useGetLetterData";
import CompleteButtonContainer from "@/components/select/CompleteButtonContainer";
import LetterBox from "@/components/select/LetterBox";
import AudioPlayer from "@/components/select/AudioPlayer";

export default function SelectPage() {
  const { data } = useGetLetterData();

  if (!data) return null;
  return (
    <article className="bg-gray-50 h-full">
      <section className="flex flex-col p-5 gap-5">
        <LetterBox
          title={data.title}
          sender={data.sender}
          content={data.content}
          fontId={data.fontId}
          fontUrl={data.fontUrl}
        />
        <AudioPlayer voiceUrl={data.voiceUrl} duration={data.duration} />
        <CompleteButtonContainer />
      </section>
    </article>
  );
}
