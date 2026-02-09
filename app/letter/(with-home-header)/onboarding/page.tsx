"use client";

import CompleteButton from "@/components/common/CompleteButton";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const handleNext = () => {
    router.push("/letter/new/record");
  };
  const onboardingSteps = [
    {
      id: 1,
      title: "편지 작성",
      description: "목소리를 녹음하여 편지를 작성합니다",
    },
    {
      id: 2,
      title: "목소리 폰트 추천",
      description: "목소리의 속도, 쉼기, 스타일을 분석한 결과에 맞는 폰트를 추천받고 편지지에 적용합니다",
    },
    {
      id: 3,
      title: "편지 꾸미기",
      description: "내용 기반 SI 분석 폰트 / 다양한 편지지 템플릿 / 내용과 분위기에 맞춰 생성한 AI 배경음을 적용합니다",
    },
    {
      id: 4,
      title: "편지 전달",
      description: "링크로 공유하거나 NFC 굿즈로 제작해 실물로 전달합니다",
    },
  ];
  return (
    <article className="flex flex-col w-full h-full px-5 pt-5 justify-between">
      <section className="flex flex-col gap-6">
        <h1 className="typo-h2-xl">이렇게 사용하세요</h1>
        <div>
          <div className="flex flex-col gap-5">
            {onboardingSteps.map((step) => (
              <div key={step.id}>
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className="text-primary-700 bg-[#E6002314] flex items-center justify-center"
                  >
                    {step.id}
                  </Badge>
                  <h2 className="typo-h2-base">{step.title}</h2>
                </div>
                <p className="typo-body1-sm text-gray-900 pl-8 whitespace-pre-line">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CompleteButton title="다음" onClick={handleNext} />
    </article>
  );
}
