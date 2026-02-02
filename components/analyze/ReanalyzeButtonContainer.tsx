"use client";

import { usePostFontRefresh } from "@/hooks/apis/post/usePostFontRefresh";
import ReanalyzeButton from "./ReanalyzeButton";

interface ReanalyzeButtonContainerProps {
  onReanalyze?: () => void;
}

export default function ReanalyzeButtonContainer({
  onReanalyze,
}: ReanalyzeButtonContainerProps) {
  const { mutate, isPending } = usePostFontRefresh();

  const handleReanalyze = () => {
    mutate();
    onReanalyze?.();
  };

  return <ReanalyzeButton onClick={handleReanalyze} isLoading={isPending} />;
}
