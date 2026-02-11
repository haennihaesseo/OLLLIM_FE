"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { LetterEditContainer } from "@/components/edit/LetterEditContainer";

export default function EditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-[80%] gap-4">
          <p className="text-gray-400 text-center typo-h2-lg">
            편지 불러오는 중...
          </p>
          <Spinner className="size-12 text-gray-400" />
        </div>
      }
    >
      <article className="bg-gray-50 h-full">
        <LetterEditContainer />
      </article>
    </Suspense>
  );
}
