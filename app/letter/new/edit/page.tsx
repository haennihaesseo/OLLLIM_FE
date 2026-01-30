import { LetterEditor } from "@/components/edit/LetterEditor";
import { VoicePlayer } from "@/components/edit/VoicePlayer";

export default function EditPage() {
  return (
    <article className="bg-gray-50 h-full">
      <section className="flex flex-col p-5 gap-4">
        <LetterEditor />
        <VoicePlayer />
      </section>
    </article>
  );
}
