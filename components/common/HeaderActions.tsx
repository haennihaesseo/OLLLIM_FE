"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type HeaderActionsProps = {
  onExit?: () => void;
};

export function HeaderActions({ onExit }: HeaderActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleExit = () => {
    if (onExit) return onExit();
    router.push("/");
  };

  // onExit이 존재하면 다이얼로그 없이 바로 실행
  if (onExit) {
    return (
      <Button
        type="button"
        variant="ghost"
        aria-label="닫기"
        className="size-6 p-0"
        onClick={handleExit}
      >
        <X className="size-6" />
      </Button>
    );
  }

  // onExit이 없으면 다이얼로그 표시
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label="닫기"
          className="size-6 p-0"
        >
          <X className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        {/* 여기에 원하는 내용과 스타일을 추가하세요 */}
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="typo-body1-sm text-gray-900 flex flex-col items-center justify-center">
            <p>지금까지 작성된 내용이 사라집니다. </p>
            <p>진행하시겠습니까</p>
          </div>
          <div className="flex gap-2 w-full justify-between">
            <Button
              onClick={() => setOpen(false)}
              className="flex-1 text-gray-900 border border-gray-300 bg-white"
            >
              취소
            </Button>
            <Button
              onClick={handleExit}
              className="flex-1 bg-primary-700 text-white"
            >
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
