import { Suspense } from "react";
import PageLoading from "@/components/common/PageLoading";
import AnalyzePageContent from "@/components/analyze/AnalyzePageContent";

export default function AnalyzePage() {
  return (
    <Suspense fallback={<PageLoading title="목소리 분석 중..." />}>
      <AnalyzePageContent />
    </Suspense>
  );
}
