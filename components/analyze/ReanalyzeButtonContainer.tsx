"use client";

import { usePostFontRefresh } from "@/hooks/apis/post/usePostFontRefresh";
import ReanalyzeButton from "./ReanalyzeButton";

interface ReanalyzeButtonContainerProps {
  letterId: string;
}

export default function ReanalyzeButtonContainer({
  letterId,
}: ReanalyzeButtonContainerProps) {
  const { mutate, isPending } = usePostFontRefresh(letterId);

  const handleReanalyze = () => {
    mutate();
  };

  return <ReanalyzeButton onClick={handleReanalyze} isLoading={isPending} />;
}
