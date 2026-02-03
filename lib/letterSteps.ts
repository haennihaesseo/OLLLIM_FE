export type StepConfig = {
  title: string;
  progress: number;
};

export const LETTER_STEPS = [
  "/letter/new/record",
  "/letter/new/edit",
  "/letter/new/analyze",
  "/letter/new/select",
  "/letter/new/share",
] as const;

export const STEP_CONFIG: Record<string, StepConfig> = {
  "/letter/new/record": { title: "목소리 담기", progress: 20 },
  "/letter/new/edit": { title: "내용 수정", progress: 40 },
  "/letter/new/analyze": { title: "목소리 분석", progress: 60 },
  "/letter/new/select": { title: "편지 설정", progress: 80 },
  "/letter/new/share": { title: "편지 공유", progress: 100 },
};

/**
 * 현재 경로의 다음 스텝 경로를 반환합니다.
 * @param currentPath 현재 경로
 * @returns 다음 스텝 경로 또는 null (마지막 스텝인 경우)
 */
export function getNextStep(currentPath: string): string | null {
  const currentIndex = LETTER_STEPS.findIndex((step) =>
    currentPath.startsWith(step),
  );

  if (currentIndex === -1 || currentIndex === LETTER_STEPS.length - 1) {
    return null;
  }

  return LETTER_STEPS[currentIndex + 1];
}

/**
 * 현재 경로의 이전 스텝 경로를 반환합니다.
 * @param currentPath 현재 경로
 * @returns 이전 스텝 경로 또는 null (첫 스텝인 경우)
 */
export function getPrevStep(currentPath: string): string | null {
  const currentIndex = LETTER_STEPS.findIndex((step) =>
    currentPath.startsWith(step),
  );

  if (currentIndex <= 0) {
    return null;
  }

  return LETTER_STEPS[currentIndex - 1];
}

/**
 * 현재 경로의 스텝 설정을 반환합니다.
 * @param currentPath 현재 경로
 * @returns 스텝 설정 또는 기본값 (매칭되는 스텝이 없는 경우)
 */
export function getStepConfig(currentPath: string): StepConfig {
  const matchedStep = LETTER_STEPS.find((step) =>
    currentPath.startsWith(step),
  );

  return matchedStep
    ? STEP_CONFIG[matchedStep]
    : { title: "편지 작성", progress: 0 };
}
