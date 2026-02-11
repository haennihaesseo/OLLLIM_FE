"use client";

import { useState } from "react";
import { useSuspenseLetterData } from "@/hooks/apis/get/useGetLetterData";
import { useAudioPlayer } from "@/hooks/common/useAudioPlayer";
import CompleteButtonContainer from "@/components/select/CompleteButtonContainer";
import LetterBox from "@/components/select/LetterBox";
import AudioPlayer from "@/components/select/AudioPlayer";
import LetterOptionsBottomSheet from "@/components/select/LetterOptionsBottomSheet";
import FloatingButton from "@/components/select/FloatingButton";

type TabType = "font" | "paper" | "bgm";

export default function SelectPageContent() {
  const { data } = useSuspenseLetterData();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabType>("font");

  const {
    status,
    currentTime,
    progress,
    duration,
    togglePlayPause,
    stop,
    seek,
  } = useAudioPlayer({
    audioUrl: data.voiceUrl,
    initialDuration: data.duration,
  });

  return (
    <article className="bg-gray-50 h-full relative">
      <section className="flex flex-col p-5 gap-8 h-full justify-between">
        <div className="flex flex-col gap-5 justify-between h-full">
          <LetterBox
            title={data.title}
            sender={data.sender}
            content={data.content}
            fontId={data.fontId}
            fontUrl={data.fontUrl}
            templateUrl={data.templateUrl}
            isEdit={true}
            words={data.words}
            currentTime={currentTime}
            status={status}
          />
          <AudioPlayer
            bgmUrl={data.bgmUrl}
            bgmSize={data.bgmSize}
            status={status}
            currentTime={currentTime}
            progress={progress}
            duration={duration}
            togglePlayPause={togglePlayPause}
            stop={stop}
            seek={seek}
          />
        </div>

        <CompleteButtonContainer />
      </section>

      <FloatingButton
        onOptionClick={(option) => {
          setSelectedTab(option);
          setIsSheetOpen(true);
        }}
      />

      <LetterOptionsBottomSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        initialTab={selectedTab}
      />
    </article>
  );
}
