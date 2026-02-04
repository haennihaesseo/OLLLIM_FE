"use client";

import { useGetLetterData } from "@/hooks/apis/get/useGetLetterData";
import { useAudioPlayer } from "@/hooks/common/useAudioPlayer";
import LetterBox from "@/components/select/LetterBox";
import AudioPlayer from "@/components/select/AudioPlayer";
import CompleteButtonContainer from "@/components/share/CompleteButtonContainer";

export default function SharePage() {
  const { data } = useGetLetterData();

  const {
    status,
    currentTime,
    progress,
    duration,
    togglePlayPause,
    stop,
    seek,
  } = useAudioPlayer({
    audioUrl: data?.voiceUrl || null,
    initialDuration: data?.duration || 0,
  });

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
          words={data.words}
          currentTime={currentTime}
        />
        <AudioPlayer
          bgmUrl={data.bgmUrl}
          status={status}
          currentTime={currentTime}
          progress={progress}
          duration={duration}
          togglePlayPause={togglePlayPause}
          stop={stop}
          seek={seek}
        />
        <CompleteButtonContainer />
      </section>
    </article>
  );
}
