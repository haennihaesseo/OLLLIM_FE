"use client";

import { useRouter, usePathname } from "next/navigation";
import NavigationButton from "@/components/common/NavigationButton";
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
    <NavigationButton
      onPrev={handlePrev}
      onNext={handleNext}
      isNextDisabled={false}
      isLoading={false}
    />
  );
}
