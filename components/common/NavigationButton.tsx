import { Button } from "../ui/button";

interface NavigationButtonProps {
  onPrev: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
  isLoading: boolean;
  nextText?: string;
}

export default function NavigationButton({
  onPrev,
  onNext,
  isNextDisabled,
  isLoading,
  nextText = "다음",
}: NavigationButtonProps) {
  return (
    <nav className="fixed bottom-15 left-0 right-0 px-5">
      <div className="flex items-start gap-4 w-full">
        <Button
          variant="outline"
          className="h-auto bg-white border-gray-200 px-4 py-3 rounded-lg typo-body1-medium-base text-gray-800"
          onClick={onPrev}
          disabled={isLoading}
        >
          이전
        </Button>

        <Button
          className="h-auto flex-1 bg-primary-700 px-4 py-3 rounded-lg typo-heading1-bold-base text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
        >
          {isLoading ? "저장 중..." : nextText}
        </Button>
      </div>
    </nav>
  );
}
