"use client";

import { useRouter, usePathname } from "next/navigation";
import CompleteButton from "@/components/common/CompleteButton";
import { getNextStep, getPrevStep } from "@/lib/letterSteps";

export default function CompleteButtonContainer() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNext = () => {
    const nextStep = getNextStep(pathname);
    if (nextStep) {
      router.push(nextStep);
    }
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
      isNextDisabled={false}
      isLoading={false}
    />
  );
}
