"use client";

import { useState } from "react";
import { useGetLetterData } from "@/hooks/apis/get/useGetLetterData";
import { LetterEditor } from "./LetterEditor";
import { VoicePlayer } from "./VoicePlayer";
import CompleteButtonContainer from "./CompleteButtonContainer";

export function LetterEditContainer() {
  const { data } = useGetLetterData();

  const [title, setTitle] = useState("");
  const [sender, setSender] = useState("");
  const [content, setContent] = useState("");

  // data가 로드되면 content 초기화
  if (data && content === "") {
    setContent(data.content);
  }

  if (!data) return null;

  return (
    <article>
      <section className="flex flex-col p-5 gap-4">
        <LetterEditor
          title={title}
          onTitleChange={setTitle}
          sender={sender}
          onSenderChange={setSender}
          content={content}
          onContentChange={setContent}
        />
        <VoicePlayer audioUrl={data.voiceUrl} />
      </section>
      <CompleteButtonContainer
        title={title}
        sender={sender}
        content={content}
      />
    </article>
  );
}
