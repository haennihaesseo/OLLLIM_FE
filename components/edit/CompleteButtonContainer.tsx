"use client";

import { useRouter, usePathname } from "next/navigation";
import { usePatchLetter } from "@/hooks/apis/patch/usePatchLetter";
import { getPrevStep, getNextStep } from "@/lib/letterSteps";
import CompleteButton from "./CompleteButton";

interface CompleteButtonContainerProps {
  title: string;
  sender: string;
  content: string;
}

export default function CompleteButtonContainer({
  title,
  sender,
  content,
}: CompleteButtonContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate, isPending } = usePatchLetter();

  const isNextDisabled = !title.trim() || !content.trim() || !sender.trim();

  const handleNext = () => {
    if (isNextDisabled) return;

    mutate(
      {
        title: title.trim(),
        sender: sender.trim(),
        content: content.trim(),
      },
      {
        onSuccess: () => {
          console.log("#1 - success");
          const basePathname = "/letter/new/edit";
          const nextStep = getNextStep(basePathname);
          if (nextStep) {
            console.log("#2 - nextStep", nextStep);
            // mutation이 완전히 완료된 후 페이지 이동
            setTimeout(() => {
              router.push(nextStep);
            }, 100);
          }
        },
      }
    );
  };

  const handlePrev = () => {
    const prevStep = getPrevStep(pathname);
    if (prevStep) {
      router.push(prevStep);
    }
  };

  return (
    <CompleteButton
      onPrev={handlePrev}
      onNext={handleNext}
      isNextDisabled={isNextDisabled}
      isLoading={isPending}
    />
  );
}
