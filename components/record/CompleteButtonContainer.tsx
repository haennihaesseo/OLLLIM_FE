"use client";

import { useAtomValue } from "jotai";
import { useRouter, usePathname } from "next/navigation";
import { recordingStatusAtom, audioBlobAtom } from "@/store/recordingAtoms";
import { usePostLetterVoice } from "@/hooks/apis/post/usePostLetterVoice";
import { getNextStep } from "@/lib/letterSteps";
import CompleteButton from "./CompleteButton";

export default function CompleteButtonContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const recordingStatus = useAtomValue(recordingStatusAtom);
  const audioBlob = useAtomValue(audioBlobAtom);
  const { mutate, isPending } = usePostLetterVoice();

  // 녹음이 완료되고 오디오 파일이 생성된 경우에만 버튼 표시
  const showButton = recordingStatus === "stopped" && audioBlob !== null;

  const handleComplete = () => {
    if (!audioBlob) return;

    mutate(audioBlob, {
      onSuccess: () => {
        const nextStep = getNextStep(pathname);
        if (nextStep) {
          router.push(nextStep);
        }
      },
      onError: () => {
        // 음성 업로드 실패
      },
    });
  };

  if (!showButton) return null;

  return <CompleteButton onClick={handleComplete} isLoading={isPending} />;
}
