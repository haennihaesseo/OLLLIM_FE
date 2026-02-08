"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useGetLetterTemplate } from "@/hooks/apis/get/useGetLetterTemplate";
import type { TemplateInfo } from "@/types/letter";
import Image from "next/image";

interface PaperTabProps {
  selectedPaper: string;
  onPaperChange: (value: string) => void;
}

export default function PaperTab({
  selectedPaper,
  onPaperChange,
}: PaperTabProps) {
  const { data } = useGetLetterTemplate();

  if (!data) {
    return null;
  }

  const renderPaperItem = (template: TemplateInfo) => {
    const templateIdStr = String(template.templateId);
    const isSelected = selectedPaper === templateIdStr;

    return (
      <div
        key={template.templateId}
        className="flex flex-col items-center gap-3"
      >
        {/* 라디오 버튼 */}
        <RadioGroupItem value={templateIdStr} id={templateIdStr} />
        <Label htmlFor={templateIdStr} className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            {/* 미리보기 카드 */}
            <div
              className={`relative w-24 h-32 border-2 overflow-hidden ${
                isSelected ? "border-primary-700" : "border-gray-200"
              }`}
            >
              <Image
                src={template.previewImageUrl}
                alt={template.name}
                fill
                className="object-cover"
              />
            </div>
            {/* 편지지 이름 */}
            <div className="text-sm font-medium text-gray-900">
              {template.name}
            </div>
          </div>
        </Label>
      </div>
    );
  };

  return (
    <div className="px-1 py-2">
      <RadioGroup value={selectedPaper} onValueChange={onPaperChange}>
        <div className="flex gap-3 justify-start overflow-x-scroll">
          {data.templates.map(renderPaperItem)}
        </div>
      </RadioGroup>
    </div>
  );
}
