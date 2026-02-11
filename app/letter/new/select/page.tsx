"use client";

import { Suspense } from "react";
import PageLoading from "@/components/common/PageLoading";
import SelectPageContent from "@/components/select/SelectPageContent";

export default function SelectPage() {
  return (
    <Suspense fallback={<PageLoading title="편지 불러오는 중..." />}>
      <SelectPageContent />
    </Suspense>
  );
}
