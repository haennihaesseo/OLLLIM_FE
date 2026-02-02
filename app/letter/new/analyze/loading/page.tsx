"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useGetLetterVoice } from "@/hooks/apis/get/useGetLetterVoice";

export default function AnalyzeLoadingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const letterId = searchParams.get("letterId");

  const { isSuccess } = useGetLetterVoice(letterId);

  useEffect(() => {
    if (isSuccess && letterId) {
      const targetPath = pathname.replace("/loading", "");
      router.push(`${targetPath}?letterId=${letterId}`);
    }
  }, [isSuccess, letterId, pathname, router]);

  return (
    <div className="flex flex-col items-center justify-center h-[80%] gap-4">
      <p className="text-gray-400 text-center typo-h2-lg">목소리 분석 중...</p>
      <Spinner className="size-12 text-gray-400" />
    </div>
  );
}
