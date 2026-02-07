"use client";

import RecordNote from "@/components/record/RecordNote";
import VoiceRecorderContainer from "@/components/record/VoiceRecorderContainer";
import CompleteButtonContainer from "@/components/record/CompleteButtonContainer";
import { useAtomValue } from "jotai";
import { audioBlobAtom, recordingTimeAtom } from "@/store/recordingAtoms";
import { usePostLetterVoice } from "@/hooks/apis/post/usePostLetterVoice";
import { Spinner } from "@/components/ui/spinner";

export default function RecordPage() {
  const audioBlob = useAtomValue(audioBlobAtom);
  const recordingTime = useAtomValue(recordingTimeAtom);
  const { mutate, isPending, isSuccess } = usePostLetterVoice();

  const handleComplete = () => {
    if (!audioBlob) return;
    mutate({ audioBlob, duration: recordingTime });
  };

  if (isPending || isSuccess)
    return (
      <div className="flex flex-col items-center justify-center h-[80%] gap-4">
        <p className="text-gray-400 text-center typo-h2-lg">
          목소리에서
          <br />
          내용 추출 중...
        </p>
        <Spinner className="size-12 text-gray-400" />
      </div>
    );

  return (
    <article className="flex flex-col justify-between h-full gap-4">
      <section className="flex flex-col justify-between h-full">
        <div className="flex flex-col p-5 gap-4">
          <p className="typo-body1-base text-gray-900">
            Tip! 바로 녹음하기 어렵다면, 초안 작성해보기
          </p>
          <RecordNote />
        </div>
        <div className="flex flex-col px-5">
          <VoiceRecorderContainer />
        </div>
      </section>
      <section className="h-[20%]">
        <CompleteButtonContainer
          onClick={handleComplete}
          disabled={isPending}
        />
      </section>
    </article>
  );
}
