"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/common/Header";
import { Progress } from "@/components/ui/progress";
import { STEP_CONFIG } from "@/lib/letterSteps";

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
