"use client";

import { useDynamicFont } from "@/hooks/common/useDynamicFont";

interface LetterBoxProps {
  title: string;
  sender: string;
  content: string;
  fontId: number;
  fontUrl: string;
  templateUrl: string;
}

export default function LetterBox({
  title,
  sender,
  content,
  fontId,
  fontUrl,
  templateUrl,
}: LetterBoxProps) {
  const fontFamilyName = useDynamicFont(fontId, fontUrl);

  return (
    <div
      style={{
        fontFamily: fontFamilyName,
        backgroundImage: `url(${templateUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="relative bg-white rounded-[0.5rem] py-10 px-5 h-122.5 flex flex-col border-2 border-dashed border-primary-700"
    >
      <h3 className="mb-4">{title}</h3>

      <div className="flex-1 overflow-y-auto">
        <p className="text-gray-900 whitespace-pre-line">{content}</p>
        <p className="text-gray-900 text-right mt-4 mb-5">From. {sender}</p>
      </div>

      {/* 하단 그라디언트 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0)0%,#FFF_80%)]" />
    </div>
  );
}
