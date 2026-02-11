"use client";

import dynamic from "next/dynamic";

const RecordNote = dynamic(() => import("@/components/record/RecordNote"), {
  ssr: false,
  loading: () => (
    <div className="h-[30%]">
      <div className="bg-gray-100 rounded-lg p-5">
        <header className="flex justify-between items-center">
          <h3 className="typo-h2-xl text-gray-900">Note</h3>
        </header>
      </div>
    </div>
  ),
});
import VoiceRecorderContainer from "@/components/record/VoiceRecorderContainer";
import CompleteButtonContainer from "@/components/record/CompleteButtonContainer";
import { useAtomValue } from "jotai";
import { audioBlobAtom, recordingTimeAtom } from "@/store/recordingAtoms";
import { usePostLetterVoice } from "@/hooks/apis/post/usePostLetterVoice";
import PageLoading from "@/components/common/PageLoading";

export default function RecordPage() {
  const audioBlob = useAtomValue(audioBlobAtom);
  const recordingTime = useAtomValue(recordingTimeAtom);
  const { mutate, isPending, isSuccess } = usePostLetterVoice();

  const handleComplete = () => {
    if (!audioBlob) return;
    mutate({ audioBlob, duration: recordingTime });
  };

  if (isPending || isSuccess)
    return <PageLoading title={"목소리에서\n내용 추출 중..."} />;

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
