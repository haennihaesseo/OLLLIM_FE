"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePostLetterView } from "@/hooks/apis/post/usePostLetterView";
import LetterLoading from "./loading";
import Image from "next/image";
import CompleteButton from "@/components/common/CompleteButton";
import LetterBox from "@/components/select/LetterBox";
import AudioPlayer from "@/components/select/AudioPlayer";
import { useAudioPlayer } from "@/hooks/common/useAudioPlayer";
import { Button } from "@/components/ui/button";
import { ArchiveIcon, Mail, Link2 } from "lucide-react";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/store/auth";
import { useRouter, useSearchParams } from "next/navigation";

export default function LetterPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIsLetterOpen = searchParams.get("isLetterOpen") === "true";
  const id = decodeURIComponent(params.id as string);
  const [isLetterOpen, setIsLetterOpen] = useState(initialIsLetterOpen);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const { mutate, data, isPending } = usePostLetterView();

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
  });

  useEffect(() => {
    mutate({
      secretLetterId: id,
      password: null,
    });
  }, [id, mutate]);

  const handleSaveLetter = () => {
    switch (isLoggedIn) {
      case true:
        console.log("편지 보관");
        break;
      case false:
        router.push(`/login?redirectUrl=/letter/${id}?isLetterOpen=true`);
        break;
    }
  };

  if (!data) return <LetterLoading />;

  switch (isLetterOpen) {
    case true:
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
              bgmUrl={data.bgm.bgmUrl}
              bgmSize={data.bgm.bgmSize}
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
            <Button
              className="w-full h-12 text-white bg-primary-700"
              disabled={isPending}
              onClick={handleSaveLetter}
            >
              <ArchiveIcon />
              <p>{isLoggedIn ? "편지 보관" : "로그인 후 편지 보관"}</p>
            </Button>
            <div className="flex items-center justify-center gap-2 w-full">
              <Button className="h-12 flex-1 bg-[#E6002314] border-primary-700 border text-primary-700">
                <Mail />
                <p>편지 작성</p>
              </Button>
              <Button className="h-12 flex-1 bg-[#E6002314] border-primary-700 border text-primary-700">
                <Link2 />
                <p>링크 복사</p>
              </Button>
            </div>
          </section>
        </article>
      );
    default:
      return (
        <article className="h-full px-5">
          <div className="flex flex-col items-center justify-center h-[75%] gap-3">
            <Image
              src="/gif/receive-motion.gif"
              alt="receive-motion"
              width={100}
              height={100}
              unoptimized
            />
            <h1 className="typo-h2-3xl text-gray-900">
              {data.sender}님으로부터 온 올림레터
            </h1>
          </div>
          <CompleteButton
            onClick={() => setIsLetterOpen(true)}
            disabled={isPending}
            title="열어 보기"
          />
        </article>
      );
  }
}
