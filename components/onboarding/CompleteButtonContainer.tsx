"use client";

import CompleteButton from "@/components/common/CompleteButton";
import { useRouter } from "next/navigation";

export const CompleteButtonContainer = () => {
  const router = useRouter();
  const handleNext = () => {
    router.push("/letter/new/record");
  };

  return <CompleteButton title="다음" onClick={handleNext} />;
};
