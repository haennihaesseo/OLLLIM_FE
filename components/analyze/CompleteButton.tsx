import { Button } from "../ui/button";

interface CompleteButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export default function CompleteButton({ onClick, disabled }: CompleteButtonProps) {
  return (
    <nav className="fixed bottom-15 left-0 right-0 px-5">
      <Button
        onClick={onClick}
        disabled={disabled}
        className="h-auto w-full bg-primary-700 px-4 py-3 rounded-lg typo-heading1-bold-base text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        완료
      </Button>
    </nav>
  );
}
