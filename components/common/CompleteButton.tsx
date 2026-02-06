import { Button } from "../ui/button";

interface CompleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}

export default function CompleteButton({
  onClick,
  disabled = false,
  title = "완료",
}: CompleteButtonProps) {
  return (
    <nav className="px-5 mb-15 w-full">
      <Button
        onClick={onClick}
        disabled={disabled}
        className="h-auto w-full bg-primary-700 px-4 py-3 rounded-lg typo-heading1-bold-base text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {title}
      </Button>
    </nav>
  );
}
