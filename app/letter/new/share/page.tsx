"use client";

import { useGetLetterData } from "@/hooks/apis/get/useGetLetterData";
import LetterBox from "@/components/select/LetterBox";
import AudioPlayer from "@/components/select/AudioPlayer";
import CompleteButtonContainer from "@/components/share/CompleteButtonContainer";

export default function SharePage() {
  const { data } = useGetLetterData();

  if (!data) return null;

  return (
    <article className="bg-gray-50 h-full relative">
      <section className="flex flex-col p-5 gap-5">
        <LetterBox
          title={data.title}
          sender={data.sender}
          content={data.content}
          fontId={data.fontId}
          fontUrl={data.fontUrl}
          templateUrl={data.templateUrl}
          isEdit={false}
        />
        <AudioPlayer
          voiceUrl={data.voiceUrl}
          duration={data.duration}
          bgmUrl={data.bgmUrl}
        />
        <CompleteButtonContainer />
      </section>
    </article>
  );
}
