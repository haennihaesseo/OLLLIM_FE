import { Suspense } from "react";
import { LetterEditContainer } from "@/components/edit/LetterEditContainer";

export default function EditPage() {
  return (
    <article className="bg-gray-50 h-full">
      <Suspense fallback={null}>
        <LetterEditContainer />
      </Suspense>
    </article>
  );
}
