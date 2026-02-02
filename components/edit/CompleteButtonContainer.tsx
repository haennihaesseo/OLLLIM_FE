"use client";

import { useRouter, usePathname } from "next/navigation";
import { usePatchLetter } from "@/hooks/apis/patch/usePatchLetter";
import { getPrevStep, getNextStep } from "@/lib/letterSteps";
import CompleteButton from "./CompleteButton";

interface CompleteButtonContainerProps {
  title: string;
  sender: string;
  content: string;
  letterId: string;
}

export default function CompleteButtonContainer({
  title,
  sender,
  content,
  letterId,
}: CompleteButtonContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate, isPending } = usePatchLetter(letterId);

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
          const basePathname = "/letter/new/edit";
          const nextStep = getNextStep(basePathname);
          
          if (nextStep) {
            router.push(`${nextStep}?letterId=${letterId}`);
          }
        },
      }
    );
  };

  const handlePrev = () => {
    const prevStep = getPrevStep(pathname);
    if (prevStep) {
      router.push(`${prevStep}?letterId=${letterId}`);
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
