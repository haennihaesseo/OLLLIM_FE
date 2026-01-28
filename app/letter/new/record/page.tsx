import RecordNote from "@/components/record/RecordNote";
import VoiceRecorderContainer from "@/components/record/VoiceRecorderContainer";
import { Button } from "@/components/ui/button";

export default function RecordPage() {
  return (
    <article>
      <section className="flex flex-col p-5 gap-4">
        <p className="typo-body1-base text-gray-900">
          Tip! 바로 녹음하기 어렵다면, 초안 작성해보기
        </p>
        <RecordNote />
      </section>

      <section className="flex flex-col p-5">
        <VoiceRecorderContainer />
      </section>

      {/* <section className="fixed bottom-15 left-0 right-0 px-5">
        <Button className="w-full typo-h2-base text-white bg-primary-700 py-3 h-auto">
          완료
        </Button>
      </section> */}
    </article>
  );
}
