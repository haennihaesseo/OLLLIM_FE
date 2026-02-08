"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetReceivedLetter } from "@/hooks/apis/get/useGetReceivedLetter";
import { useGetSentLetter } from "@/hooks/apis/get/useGetSentLetter";
import { Archive, Mail, Link2 } from "lucide-react";
import { useState } from "react";
import type { SimpleLetterData } from "@/types/letter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetMyLetter } from "@/hooks/apis/get/useGetMyLetter";
import { useAudioPlayer } from "@/hooks/common/useAudioPlayer";
import { toast } from "sonner";
import LetterLoading from "../[id]/loading";
import LetterBox from "@/components/select/LetterBox";
import AudioPlayer from "@/components/select/AudioPlayer";
import useGetSecretId from "@/hooks/apis/get/useGetSecretId";

// 날짜 포맷 함수 (예: 2026-01-22 -> 26.01.22)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

// 편지 리스트 아이템 컴포넌트
const LetterListItem = ({
  letter,
  isSent = false,
  onClick,
}: {
  letter: SimpleLetterData;
  isSent?: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="w-full" onClick={onClick}>
      <div className="flex items-center justify-between py-4 cursor-pointer">
        <div className="flex items-center gap-3">
          <Mail className="text-red-500 w-6 h-6" />
          <span className="typo-body1-md text-gray-900">
            {isSent ? `${letter.title}에게` : `${letter.sender}님으로부터`}
          </span>
        </div>
        <span className="typo-body2-sm text-gray-500">
          {formatDate(letter.createdAt)}
        </span>
      </div>
    </div>
  );
};

export const MyLetterPage = ({
  letterId,
}: {
  letterId: string;
  onBack: () => void;
}) => {
  const { data, isPending } = useGetMyLetter(letterId);
  const router = useRouter();

  const {
    status,
    currentTime,
    progress,
    duration,
    togglePlayPause,
    stop,
    seek,
  } = useAudioPlayer({
    audioUrl: data?.voice.voiceUrl || null,
    initialDuration: data?.voice.duration || 0,
  });

  const { data: secretId } = useGetSecretId(letterId);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/letter/${secretId?.secretLetterId}`,
    );
    toast.success("링크가 복사되었습니다");
  };
  const handleWriteLetter = () => {
    router.push(`/letter/new/record`);
  };

  if (isPending || !data) return <LetterLoading />;

  return (
    <article className="bg-gray-50 h-full relative">
      <section className="flex flex-col p-5 gap-5">
        <LetterBox
          title={data.title}
          sender={data.sender}
          content={data.content}
          fontId={data.font.fontId}
          fontUrl={data.font.fontUrl}
          templateUrl={data.template.templateUrl}
          isEdit={false}
          words={data.words}
          currentTime={currentTime}
          status={status}
        />
        <AudioPlayer
          bgmUrl={data.bgm?.bgmUrl}
          bgmSize={data.bgm?.bgmSize}
          status={status}
          currentTime={currentTime}
          progress={progress}
          duration={duration}
          togglePlayPause={togglePlayPause}
          stop={stop}
          seek={seek}
        />
      </section>
      <section className="flex flex-col items-center justify-center gap-2 p-5 typo-h1-base">
        <div className="flex items-center justify-center gap-2 w-full">
          <Button
            className="h-12 flex-1 bg-[#E6002314] border-primary-700 border text-primary-700"
            onClick={handleWriteLetter}
          >
            <Mail />
            <p>편지 작성</p>
          </Button>
          <Button
            className="h-12 flex-1 bg-[#E6002314] border-primary-700 border text-primary-700"
            onClick={handleCopyLink}
          >
            <Link2 />
            <p>링크 복사</p>
          </Button>
        </div>
      </section>
    </article>
  );
};

export default function ArchivePage() {
  const [tabType, setTabType] = useState("received");
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const tabs = [
    {
      value: "received",
      label: "받은 편지",
    },
    {
      value: "sent",
      label: "보낸 편지",
    },
  ];

  const { data: receivedLetter } = useGetReceivedLetter();
  const { data: sentLetter } = useGetSentLetter();

  // 편지 상세 보기 상태일 때
  if (selectedLetterId) {
    return (
      <MyLetterPage
        letterId={selectedLetterId}
        onBack={() => setSelectedLetterId(null)}
      />
    );
  }

  // 편지 목록 보기 상태일 때
  return (
    <article className="flex flex-col items-start justify-center px-5">
      <header className="flex gap-2 items-center">
        <Archive size={28} />
        <h1 className="typo-h2-3xl text-gray-900">올림 보관함</h1>
      </header>
      <section className="w-full mt-5">
        <Tabs
          value={tabType}
          onValueChange={setTabType}
          className="w-full h-10.5"
        >
          <TabsList className="w-full rounded-full h-10.5">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="typo-body1-md rounded-full
                data-[state=active]:bg-primary-700 data-[state=active]:text-white
                data-[state=inactive]:text-gray-500"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="px-2">
          {tabType === "received" ? (
            <div className="w-full">
              {receivedLetter && receivedLetter.length > 0 ? (
                receivedLetter.map((letter) => (
                  <LetterListItem
                    key={letter.letterId}
                    letter={letter}
                    isSent={false}
                    onClick={() => setSelectedLetterId(letter.letterId)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  받은 편지가 없습니다
                </p>
              )}
            </div>
          ) : (
            <div className="w-full">
              {sentLetter && sentLetter.length > 0 ? (
                sentLetter.map((letter) => (
                  <LetterListItem
                    key={letter.letterId}
                    letter={letter}
                    isSent={true}
                    onClick={() => setSelectedLetterId(letter.letterId)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  보낸 편지가 없습니다
                </p>
              )}
            </div>
          )}
        </div>
        <Button className="fixed bottom-15 left-0 right-0 w-[90%] mx-auto h-11.5 bg-[#E6002314] border-primary-700 border text-primary-700 typo-h1-base">
          <Link href="/letter/new/record">편지 작성하기</Link>
        </Button>
      </section>
    </article>
  );
}
