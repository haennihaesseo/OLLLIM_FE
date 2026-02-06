"use client";

import { LetterNewHeader } from "@/components/letter/LetterNewHeader";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { audioBlobAtom, recordingStatusAtom } from "@/store/recordingAtoms";

export default function LetterNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAudioBlob = useSetAtom(audioBlobAtom);
  const setRecordingStatus = useSetAtom(recordingStatusAtom);

  useEffect(() => {
    // /letter/new 경로에서 벗어날 때 녹음 관련 전역 상태 초기화
    return () => {
      setAudioBlob(null);
      setRecordingStatus("idle");
    };
  }, [setAudioBlob, setRecordingStatus]);

  return (
    <div className="h-dvh flex flex-col">
      <LetterNewHeader />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
