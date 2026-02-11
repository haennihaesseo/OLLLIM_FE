"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ArchiveLetterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[80%] gap-6">
      <div className="text-center space-y-2">
        <p className="typo-h2-lg text-gray-700">편지를 불러올 수 없어요</p>
        <p className="typo-body-md text-gray-400">
          {error.message || "잠시 후 다시 시도해 주세요."}
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          뒤로가기
        </Button>
        <Button onClick={reset}>다시 시도</Button>
      </div>
    </div>
  );
}
