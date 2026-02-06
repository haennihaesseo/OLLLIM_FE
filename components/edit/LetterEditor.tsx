"use client";

interface LetterEditorProps {
  title: string;
  onTitleChange: (value: string) => void;
  sender: string;
  onSenderChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
}

export function LetterEditor({
  title,
  onTitleChange,
  sender,
  onSenderChange,
  content,
  onContentChange,
}: LetterEditorProps) {
  return (
    <div className="relative bg-white rounded-[0.5rem] py-10 px-5 min-h-96 flex flex-col">
      {/* To 입력 */}
      <div className="flex items-center gap-2 mb-4">
        <label className="text-gray-400 typo-h2-xl shrink-0">To.</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          style={{ width: title ? `${title.length + 3}ch` : "3ch" }}
          className="max-w-full border-b border-gray-400 outline-none typo-body1-base text-gray-900 mb-1"
        />
      </div>

      {/* Content 편집 영역 */}
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="flex-1 text-gray-800 typo-body1-base outline-none resize-none"
        placeholder="편지 내용을 입력하세요"
      />

      {/* From 입력 */}
      <div className="flex items-center gap-2 mb-4 justify-end">
        <label className="text-gray-400 typo-h2-xl shrink-0">From.</label>
        <input
          type="text"
          value={sender}
          onChange={(e) => onSenderChange(e.target.value)}
          style={{ width: sender ? `${sender.length + 3}ch` : "3ch" }}
          className="max-w-full border-b border-gray-400 outline-none typo-body1-base text-gray-900 mb-1 text-right"
        />
      </div>

      {/* 하단 그라디언트 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0)0%,#FFF_80%)]" />
    </div>
  );
}
