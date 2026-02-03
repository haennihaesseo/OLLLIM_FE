"use client";

import { useState } from "react";
import { useGetLetterData } from "@/hooks/apis/get/useGetLetterData";
import CompleteButtonContainer from "@/components/select/CompleteButtonContainer";
import LetterBox from "@/components/select/LetterBox";
import AudioPlayer from "@/components/select/AudioPlayer";
import LetterOptionsBottomSheet from "@/components/select/LetterOptionsBottomSheet";
import FloatingButton from "@/components/select/FloatingButton";

export default function SelectPage() {
  const { data } = useGetLetterData();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
        />
        <AudioPlayer voiceUrl={data.voiceUrl} duration={data.duration} />
        <CompleteButtonContainer />
      </section>

      <FloatingButton onClick={() => setIsSheetOpen(true)} />

      <LetterOptionsBottomSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </article>
  );
}
