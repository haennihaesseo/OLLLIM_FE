"use client";

import { useState } from "react";
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

interface LetterOptionsBottomSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
}: LetterOptionsBottomSheetProps) {
  const [activeTab, setActiveTab] = useState<TabType>("font");
  const [selectedFont, setSelectedFont] = useState("font1");

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
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
          {activeTab === "paper" && <PaperTab />}
          {activeTab === "bgm" && <BgmTab />}
        </div>

        {/* 하단 버튼 - 적용하기 */}
        <section className="flex justify-center fixed bottom-12 left-0 right-0 px-5">
          <Button
            variant="default"
            className="w-full typo-h1-base h-11 bg-[#E6002314] text-primary-700 border border-primary-700"
          >
            적용하기
          </Button>
        </section>
      </SheetContent>
    </Sheet>
  );
}
