"use client";

import { useDynamicFont } from "@/hooks/common/useDynamicFont";
import type { Word } from "@/types/letter";
import type { PlaybackStatus } from "@/types/recording";

interface LetterBoxProps {
  title: string;
  sender: string;
  content: string;
  fontId: number;
  fontUrl: string;
  templateUrl: string;
  isEdit?: boolean;
  words?: Word[];
  currentTime?: number;
  status?: PlaybackStatus;
}

export default function LetterBox({
  title,
  sender,
  content,
  fontId,
  fontUrl,
  templateUrl,
  isEdit = false,
  words,
  currentTime = 0,
  status = "idle",
}: LetterBoxProps) {
  const fontFamilyName = useDynamicFont(fontId, fontUrl);

  // content를 기반으로 words 배열과 매칭하여 렌더링
  const renderContent = () => {
    if (!words || words.length === 0) {
      return content;
    }

    // content를 줄바꿈 유지하면서 처리
    const parts: React.ReactNode[] = [];
    let contentIndex = 0;
    let wordIndex = 0;

    while (contentIndex < content.length && wordIndex < words.length) {
      const currentWord = words[wordIndex];
      const wordStartIndex = content.indexOf(currentWord.word, contentIndex);

      // 현재 단어를 찾을 수 없으면 다음 단어로
      if (wordStartIndex === -1) {
        wordIndex++;
        continue;
      }

      // 단어 이전의 텍스트(공백, 줄바꿈 등) 추가
      if (wordStartIndex > contentIndex) {
        const beforeText = content.substring(contentIndex, wordStartIndex);
        parts.push(
          <span key={`before-${wordIndex}`} className="text-gray-900">
            {beforeText}
          </span>,
        );
      }

      // 현재 단어 추가 (하이라이트 적용)
      // status가 idle일 때는 하이라이트하지 않음
      const isActive =
        status !== "idle" &&
        currentWord.startTime !== null &&
        currentWord.endTime !== null &&
        currentTime >= currentWord.startTime &&
        currentTime <= currentWord.endTime;

      parts.push(
        <span
          key={`word-${wordIndex}`}
          className={isActive ? "text-primary-700" : "text-gray-900"}
        >
          {currentWord.word}
        </span>,
      );

      contentIndex = wordStartIndex + currentWord.word.length;
      wordIndex++;
    }

    // 남은 텍스트 추가
    if (contentIndex < content.length) {
      parts.push(
        <span key="after" className="text-gray-900">
          {content.substring(contentIndex)}
        </span>,
      );
    }

    return parts;
  };

  return (
    <div
      style={{
        fontFamily: fontFamilyName,
        backgroundImage: `url(${templateUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className={`relative bg-white rounded-[0.5rem] py-10 px-5 h-full  flex flex-col ${
        isEdit ? "border-2 border-dashed border-primary-700" : ""
      }`}
    >
      <h3 className="mb-4">{title}</h3>

      <div className="flex-1 overflow-y-auto">
        <p className="whitespace-pre-wrap">{renderContent()}</p>
        <p className="text-gray-900 text-right mt-4 mb-5">From. {sender}</p>
      </div>
    </div>
  );
}
