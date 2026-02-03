"use client";

import CompleteButton from "@/components/common/CompleteButton";

export default function CompleteButtonContainer() {
  const handleNext = () => {};

  const handlePrev = () => {};

  return (
    <CompleteButton
      onPrev={handlePrev}
      onNext={handleNext}
      isNextDisabled={false}
      isLoading={false}
    />
  );
}
