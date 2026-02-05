"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavigationButton from "@/components/common/NavigationButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CompleteButtonContainer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleNextClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
    router.push("/login?redirectUrl=/letter/complete");
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <NavigationButton
        onPrev={() => {}}
        onNext={handleNextClick}
        isNextDisabled={false}
        isLoading={false}
        nextText="로그인 후 편지 링크 생성하기"
      />

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="w-[90%] max-w-sm rounded-2xl p-6">
          <AlertDialogTitle className="typo-body1-md text-gray-900 text-center">
            편지 생성 시 수정이 불가합니다. <br />
            진행하시겠습니까?
          </AlertDialogTitle>
          <AlertDialogFooter className="flex-row gap-2 mt-4">
            <AlertDialogCancel
              onClick={handleCancel}
              className="mt-0 flex-1 h-12 rounded-lg typo-body1-base border-gray-200"
            >
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="flex-1 h-12 rounded-lg typo-body1-base bg-primary-700 hover:bg-primary-800"
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
