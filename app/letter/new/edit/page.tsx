import { Suspense } from "react";
import { LetterEditContainer } from "@/components/edit/LetterEditContainer";

export default function EditPage() {
  return (
    <article className="bg-gray-50 h-full">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        }
      >
        <LetterEditContainer />
      </Suspense>
    </article>
  );
}
