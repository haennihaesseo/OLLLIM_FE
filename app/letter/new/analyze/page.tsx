"use client";

import { useSearchParams } from "next/navigation";
import { useGetLetterVoice } from "@/hooks/apis/get/useGetLetterVoice";

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const letterId = searchParams.get("letterId");

  const { data, isLoading } = useGetLetterVoice(letterId);
  if (isLoading) return null;

  return (
    <div>
      <h1>Analyze Page</h1>
      {/* 여기서 data를 사용하여 UI 구현 */}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
