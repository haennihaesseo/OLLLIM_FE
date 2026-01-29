"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/common/Header";
import { Progress } from "@/components/ui/progress";

type StepConfig = {
  title: string;
  progress: number;
};

const STEP_CONFIG: Record<string, StepConfig> = {
  "/letter/new/record": { title: "목소리 담기", progress: 20 },
  "/letter/new/edit": { title: "내용 수정", progress: 40 },
  "/letter/new/analyze": { title: "목소리 분석", progress: 60 },
  "/letter/new/select": { title: "편지 설정", progress: 80 },
  "/letter/new/share": { title: "편지 공유", progress: 100 },
};

export function LetterNewHeader() {
  const pathname = usePathname();
  const config = STEP_CONFIG[pathname] || { title: "편지 작성", progress: 0 };

  return (
    <>
      {/* Header */}
      <Header title={config.title} />

      {/* Progress */}
      <section className="px-5 pt-2.5">
        <Progress
          value={config.progress}
          className="bg-gray-300 rounded-full h-1"
          indicatorClassName="bg-gray-500"
        />
      </section>
    </>
  );
}
