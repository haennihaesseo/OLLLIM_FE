"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePostLetterView } from "@/hooks/apis/post/usePostLetterView";
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
import { toast } from "sonner";
import { usePostLetterArchive } from "@/hooks/apis/post/usePostLetterArchive";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import PageLoading from "@/components/common/PageLoading";

export default function LetterPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIsLetterOpen = searchParams.get("isLetterOpen") === "true";
  const secretId = decodeURIComponent(params.id as string);
  const [isLetterOpen, setIsLetterOpen] = useState(initialIsLetterOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const { mutate, data, isPending } = usePostLetterView();
  const { mutate: saveLetter } = usePostLetterArchive();

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

  useEffect(() => {
    mutate(
      {
        secretLetterId: secretId,
        password: null,
      },
      {
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { code?: string } };
          };
          if (axiosError?.response?.data?.code === "LETTER_NEED_PASSWORD") {
            setNeedsPassword(true);
          }
        },
      }
    );
  }, [secretId, mutate]);

  const handleSaveLetter = () => {
    switch (isLoggedIn) {
      case true:
        saveLetter(data!.letterId);
        break;
      case false:
        router.push(`/login?redirectUrl=/letter/${secretId}`);
        break;
    }
  };

  const handleWriteLetter = () => {
    router.push(`/letter/new/record`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("링크가 복사되었습니다");
  };

  const handleOpenLetter = () => {
    if (needsPassword) {
      setPasswordDialogOpen(true);
    } else {
      setIsAnimating(true);
      // receive-motion.gif 애니메이션 재생 후 편지 열기 (약 3초)
      setTimeout(() => {
        setIsLetterOpen(true);
        setIsAnimating(false);
      }, 3000);
    }
  };

  const handlePasswordSubmit = () => {
    mutate(
      {
        secretLetterId: secretId,
        password: password,
      },
      {
        onSuccess: () => {
          setPasswordDialogOpen(false);
          setNeedsPassword(false);
          setIsAnimating(true);
          // receive-motion.gif 애니메이션 재생 후 편지 열기 (약 3초)
          setTimeout(() => {
            setIsLetterOpen(true);
            setIsAnimating(false);
          }, 3000);
        },
        onError: () => {
          toast.error("비밀번호가 올바르지 않습니다");
        },
      }
    );
  };

  if (!data && !needsPassword)
    return <PageLoading title="편지 불러오는 중..." />;

  switch (isLetterOpen) {
    case true:
      if (!data) return <PageLoading title="편지 불러오는 중..." />;
      return (
        <article className="bg-gray-50 h-full relative">
          <motion.section
            className="flex flex-col p-5 gap-5"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
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
          </motion.section>
          <motion.section
            className="flex flex-col items-center justify-center gap-2 p-5 typo-h1-base"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <Button
              className="w-full h-12 text-white bg-primary-700"
              disabled={isPending || !data}
              onClick={handleSaveLetter}
            >
              <ArchiveIcon />
              <p>{isLoggedIn ? "편지 보관" : "로그인 후 편지 보관"}</p>
            </Button>
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
          </motion.section>
        </article>
      );
    default:
      return (
        <>
          <article className="h-full px-5">
            <div className="flex flex-col items-center justify-center h-[75%] gap-3">
              <Image
                src={
                  isAnimating ? "/gif/receive-motion.gif" : "/gif/message.gif"
                }
                alt={isAnimating ? "receive-motion" : "message"}
                width={160}
                height={160}
                unoptimized
              />
              <h1 className="typo-h2-3xl text-gray-900">
                {needsPassword
                  ? "도착한 올림레터"
                  : `${data?.sender}님으로부터 온 올림레터`}
              </h1>
            </div>
            <CompleteButton
              onClick={handleOpenLetter}
              disabled={isPending || isAnimating}
              title="열어 보기"
            />
          </article>

          <Dialog
            open={passwordDialogOpen}
            onOpenChange={setPasswordDialogOpen}
          >
            <DialogContent className="w-[90%] max-w-100 rounded-lg p-0 gap-0">
              <DialogHeader className="flex items-center justify-start w-full">
                <DialogTitle className="flex px-7 text-center justify-start typo-h2-base text-gray-900 mt-5 w-full">
                  비밀번호 입력하기
                </DialogTitle>
              </DialogHeader>
              <div className="p-5 flex items-center justify-center gap-2 w-full h-full">
                <Input
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePasswordSubmit();
                    }
                  }}
                  className="w-full h-full"
                />
                <Button
                  onClick={handlePasswordSubmit}
                  disabled={!password || isPending}
                  className="h-full bg-[#E6002314] border-primary-700 border text-primary-700"
                >
                  확인
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
  }
}
