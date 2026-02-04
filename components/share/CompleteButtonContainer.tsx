import CompleteButton from "@/components/common/CompleteButton";

export default function CompleteButtonContainer() {
  return (
    <CompleteButton
      onPrev={() => {}}
      onNext={() => {}}
      isNextDisabled={false}
      isLoading={false}
      nextText="로그인 후 편지 링크 생성하기"
    />
  );
}
