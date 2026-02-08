"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import FontTab from "./tabs/FontTab";
import PaperTab from "./tabs/PaperTab";
import BgmTab from "./tabs/BgmTab";
import { usePostLetterFont } from "@/hooks/apis/post/usePostLetterFont";
import { usePostLetterBgm } from "@/hooks/apis/post/usePostLetterBgm";
import { usePostLetterTemplate } from "@/hooks/apis/post/usePostLetterTemplate";
import { letterIdAtom } from "@/store/letterAtoms";

interface LetterOptionsBottomSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: TabType;
}

type TabType = "font" | "paper" | "bgm";

const tabs = [
  { id: "font" as TabType, label: "폰트" },
  { id: "paper" as TabType, label: "편지지" },
  { id: "bgm" as TabType, label: "배경음" },
];

export default function LetterOptionsBottomSheet({
  isOpen,
  onOpenChange,
  initialTab = "font",
}: LetterOptionsBottomSheetProps) {
  const queryClient = useQueryClient();
  const [letterId] = useAtom(letterIdAtom);

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedFont, setSelectedFont] = useState("font1");
  const [selectedPaper, setSelectedPaper] = useState("1");
  const [selectedBgm, setSelectedBgm] = useState("1");
  const [volume, setVolume] = useState(50);

  // 초기값 저장 (변경 감지용)
  const [initialValues, setInitialValues] = useState({
    font: "font1",
    paper: "1",
    bgm: "1",
    volume: 50,
  });

  // Sheet가 열릴 때 initialTab으로 activeTab 설정
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Sheet 열림 상태 변경 핸들러 (열릴 때 초기값 저장)
  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Sheet가 열릴 때 현재 값을 초기값으로 저장
      setInitialValues({
        font: selectedFont,
        paper: selectedPaper,
        bgm: selectedBgm,
        volume: volume,
      });
    }
    onOpenChange(open);
  };

  // API hooks (skipInvalidate: true로 중복 invalidate 방지)
  const postFont = usePostLetterFont({
    skipInvalidate: true,
    skipNavigation: true,
  });
  const postBgm = usePostLetterBgm({ skipInvalidate: true });
  const postTemplate = usePostLetterTemplate({ skipInvalidate: true });

  const isLoading =
    postFont.isPending || postBgm.isPending || postTemplate.isPending;

  const handleApply = async () => {
    try {
      // 폰트가 변경된 경우
      if (selectedFont !== initialValues.font) {
        await postFont.mutateAsync(Number(selectedFont));
      }

      // BGM이 변경되었거나 볼륨이 변경된 경우
      if (
        selectedBgm !== initialValues.bgm ||
        volume !== initialValues.volume
      ) {
        await postBgm.mutateAsync({
          bgmId: selectedBgm === "none" ? null : selectedBgm,
          bgmSize: selectedBgm === "none" ? null : volume,
        });
      }

      // 편지지가 변경된 경우
      if (selectedPaper !== initialValues.paper) {
        await postTemplate.mutateAsync({
          templateId: selectedPaper,
        });
      }

      // letter 데이터 쿼리 무효화
      await queryClient.invalidateQueries({
        queryKey: ["letter", letterId],
      });

      // 성공 시 BottomSheet 닫기
      onOpenChange(false);
    } catch (error) {
      console.error("편지 설정 적용 중 오류:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-[0.75rem] px-5 pb-28"
        showCloseButton={false}
      >
        {/* 최상단 핸들바 */}
        <div className="flex justify-center pt-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <SheetHeader className="p-0">
          <SheetTitle className="text-center typo-h2-base text-gray-900">
            편지 설정
          </SheetTitle>
        </SheetHeader>

        {/* 3가지 탭 */}
        <section className="flex bg-gray-100 rounded-full shadow-sm gap-2 px-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex-1 rounded-full typo-h3-base text-gray-500 my-1 ${
                activeTab === tab.id ? "bg-primary-700 text-white" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </section>

        {/* 탭 컨텐츠 */}
        <div className="h-73 overflow-y-auto">
          {activeTab === "font" && (
            <FontTab
              selectedFont={selectedFont}
              onFontChange={setSelectedFont}
            />
          )}
          {activeTab === "paper" && (
            <PaperTab
              selectedPaper={selectedPaper}
              onPaperChange={setSelectedPaper}
            />
          )}
          {activeTab === "bgm" && (
            <BgmTab
              selectedBgm={selectedBgm}
              onBgmChange={setSelectedBgm}
              volume={volume}
              onVolumeChange={setVolume}
            />
          )}
        </div>

        {/* 하단 버튼 - 적용하기 */}
        <section className="flex justify-center fixed bottom-12 left-0 right-0 px-5">
          <Button
            variant="default"
            className="w-full typo-h1-base h-11 bg-[#E6002314] text-primary-700 border border-primary-700"
            onClick={handleApply}
            disabled={isLoading}
          >
            {isLoading ? "적용 중..." : "적용하기"}
          </Button>
        </section>
      </SheetContent>
    </Sheet>
  );
}
