"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface LetterOptionsBottomSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LetterOptionsBottomSheet({
  isOpen,
  onOpenChange,
}: LetterOptionsBottomSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>편지 옵션</SheetTitle>
          <SheetDescription>
            편지에 대한 작업을 선택해주세요.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3 p-4">
          <Button
            variant="outline"
            className="w-full justify-start text-left"
            onClick={() => {
              // TODO: 편집 기능 구현
              console.log("편집 클릭");
            }}
          >
            편집하기
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-left"
            onClick={() => {
              // TODO: 공유 기능 구현
              console.log("공유 클릭");
            }}
          >
            공유하기
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-left"
            onClick={() => {
              // TODO: 저장 기능 구현
              console.log("저장 클릭");
            }}
          >
            저장하기
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start text-left"
            onClick={() => {
              // TODO: 삭제 기능 구현
              console.log("삭제 클릭");
            }}
          >
            삭제하기
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
