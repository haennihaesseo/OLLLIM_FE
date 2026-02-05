"use client";

import { usePostLetterFont } from "@/hooks/apis/post/usePostLetterFont";
import CompleteButton from "../common/CompleteButton";

interface CompleteButtonContainerProps {
  selectedFontId?: number;
}

export default function CompleteButtonContainer({
  selectedFontId,
}: CompleteButtonContainerProps) {
  const { mutate: postLetterFont, isPending } = usePostLetterFont();

  const handleComplete = () => {
    postLetterFont(selectedFontId!);
  };

  return (
    <CompleteButton
      onClick={handleComplete}
      disabled={!selectedFontId || isPending}
    />
  );
}
