"use client";

import { Suspense } from "react";
import PageLoading from "@/components/common/PageLoading";
import { LetterEditContainer } from "@/components/edit/LetterEditContainer";

export default function EditPage() {
  return (
    <Suspense fallback={<PageLoading title="편지 불러오는 중..." />}>
      <article className="bg-gray-50 h-full">
        <LetterEditContainer />
      </article>
    </Suspense>
  );
}
