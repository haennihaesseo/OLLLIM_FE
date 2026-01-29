import { Button } from "@/components/ui/button";

interface CompleteButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function CompleteButton({
  onClick,
  isLoading = false,
  disabled = false,
}: CompleteButtonProps) {
  return (
    <section className="fixed bottom-10 left-0 right-0 px-5">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        className="w-full typo-h2-base text-white bg-primary-700 py-3 h-auto"
      >
        {isLoading ? "업로드 중..." : "완료"}
      </Button>
    </section>
  );
}
