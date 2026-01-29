"use client";

import { useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import { recordingStatusAtom, audioBlobAtom } from "@/store/recordingAtoms";

export default function CompleteButton() {
  const recordingStatus = useAtomValue(recordingStatusAtom);
  const audioBlob = useAtomValue(audioBlobAtom);

  // 녹음이 완료되고 오디오 파일이 생성된 경우에만 버튼 표시
  const showButton = recordingStatus === "stopped" && audioBlob !== null;

  if (!showButton) return null;

  return (
    <section className="fixed bottom-10 left-0 right-0 px-5">
      <Button className="w-full typo-h2-base text-white bg-primary-700 py-3 h-auto">
        완료
      </Button>
    </section>
  );
}
