import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginRequiredPageProps {
  title?: string;
  description?: string;
  onLoginClick?: () => void;
}

export default function LoginRequiredPage({
  title = "로그인이 필요합니다",
  description = "이 페이지를 보려면 로그인이 필요합니다.",
  onLoginClick,
}: LoginRequiredPageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[90%] bg-gray-50 p-5">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        {/* 아이콘 */}
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
          <LogIn className="w-10 h-10 text-primary-700" />
        </div>

        {/* 텍스트 */}
        <div className="flex flex-col gap-2">
          <h1 className="typo-h1-bold text-primary-900">{title}</h1>
          <p className="typo-body1-base text-gray-600">{description}</p>
        </div>

        {/* 버튼 (선택적) */}
        {onLoginClick && (
          <Button
            onClick={onLoginClick}
            className="h-12 px-6 bg-primary-700 text-white"
          >
            로그인하러 가기
          </Button>
        )}
      </div>
    </div>
  );
}
