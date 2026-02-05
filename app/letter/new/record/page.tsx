import RecordNote from "@/components/record/RecordNote";
import VoiceRecorderContainer from "@/components/record/VoiceRecorderContainer";
import CompleteButtonContainer from "@/components/record/CompleteButtonContainer";

export default function RecordPage() {
  return (
    <article className="flex flex-col justify-between h-full">
      <div>
        <section className="flex flex-col p-5 gap-4">
          <p className="typo-body1-base text-gray-900">
            Tip! 바로 녹음하기 어렵다면, 초안 작성해보기
          </p>
          <RecordNote />
        </section>

        <section className="flex flex-col px-5">
          <VoiceRecorderContainer />
        </section>
      </div>

      <CompleteButtonContainer />
    </article>
  );
}
