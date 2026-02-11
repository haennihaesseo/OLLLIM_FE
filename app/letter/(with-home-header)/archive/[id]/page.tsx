"use client";

import PageLoading from "@/components/common/PageLoading";
import LoginRequiredPage from "@/components/common/LoginRequiredPage";
import AudioPlayer from "@/components/select/AudioPlayer";
import LetterBox from "@/components/select/LetterBox";
import { Button } from "@/components/ui/button";
import { useGetMyLetter } from "@/hooks/apis/get/useGetMyLetter";
import useGetSecretId from "@/hooks/apis/get/useGetSecretId";
import { useAudioPlayer } from "@/hooks/common/useAudioPlayer";
import { Link2, Mail } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/store/auth";

export default function MyLetterPage() {
  const params = useParams();
  const router = useRouter();
  const letterId = decodeURIComponent(params.id as string);
  const { data, isPending } = useGetMyLetter(letterId);
  const [isLoggedIn] = useAtom(isLoggedInAtom);

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
      `${window.location.origin}/letter/${secretId?.secretLetterId}`
    );
    toast.success("링크가 복사되었습니다");
  };
  const handleWriteLetter = () => {
    router.push(`/letter/new/record`);
  };

  if (!isLoggedIn) {
    return (
      <LoginRequiredPage
        title="로그인이 필요합니다"
        description="보관함에 저장된 편지를 보려면 로그인이 필요합니다."
      />
    );
  }

  if (isPending || !data) return <PageLoading title="편지 불러오는 중..." />;

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
}
