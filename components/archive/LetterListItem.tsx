import type { SimpleLetterData } from "@/types/letter";
import { Mail } from "lucide-react";
import Link from "next/link";

// 날짜 포맷 함수 (예: 2026-01-22 -> 26.01.22)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

export const LetterListItem = ({
  letter,
  isSent = false,
}: {
  letter: SimpleLetterData;
  isSent?: boolean;
}) => {
  return (
    <Link className="w-full" href={`/letter/archive/${letter.letterId}`}>
      <div className="flex items-center justify-between py-4 cursor-pointer">
        <div className="flex items-center gap-3">
          <Mail className="text-red-500 w-6 h-6" />
          <span className="typo-body1-md text-gray-900">
            {isSent ? `${letter.title}에게` : `${letter.sender}님으로부터`}
          </span>
        </div>
        <span className="typo-body2-sm text-gray-500">
          {formatDate(letter.createdAt)}
        </span>
      </div>
    </Link>
  );
};
