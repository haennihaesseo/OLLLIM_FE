"use client";

import { useAtomValue } from "jotai";
import { useRouter, usePathname } from "next/navigation";
import { recordingStatusAtom, audioBlobAtom } from "@/store/recordingAtoms";
import { usePostLetterVoice } from "@/hooks/apis/post/usePostLetterVoice";
import CompleteButton from "../common/CompleteButton";

export default function CompleteButtonContainer({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  const recordingStatus = useAtomValue(recordingStatusAtom);
  const audioBlob = useAtomValue(audioBlobAtom);

  // 녹음이 완료되고 오디오 파일이 생성된 경우에만 버튼 표시
  const showButton = recordingStatus === "stopped" && audioBlob !== null;

  if (!showButton) return null;

  return <CompleteButton onClick={onClick} disabled={disabled} />;
}
