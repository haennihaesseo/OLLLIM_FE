"use client";

import { usePostFontRefresh } from "@/hooks/apis/post/usePostFontRefresh";
import ReanalyzeButton from "./ReanalyzeButton";

export default function ReanalyzeButtonContainer() {
  const { mutate, isPending } = usePostFontRefresh();

  const handleReanalyze = () => {
    mutate();
  };

  return <ReanalyzeButton onClick={handleReanalyze} isLoading={isPending} />;
}
