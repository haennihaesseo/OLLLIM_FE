"use client";

import { useState } from "react";
import { useSuspenseLetterData } from "@/hooks/apis/get/useGetLetterData";
import { LetterEditor } from "./LetterEditor";
import { VoicePlayer } from "./VoicePlayer";
import CompleteButtonContainer from "./CompleteButtonContainer";

export function LetterEditContainer() {
  const { data } = useSuspenseLetterData();
  const [title, setTitle] = useState("");
  const [sender, setSender] = useState("");
  const [content, setContent] = useState(data.content);

  return (
    <article className="flex flex-col justify-between h-full">
      <section className="flex flex-col pt-5 px-5 gap-4 h-full justify-between">
        <LetterEditor
          title={title}
          onTitleChange={setTitle}
          sender={sender}
          onSenderChange={setSender}
          content={content}
          onContentChange={setContent}
        />
        <VoicePlayer audioUrl={data.voiceUrl} />
        <CompleteButtonContainer
          title={title}
          sender={sender}
          content={content}
        />
      </section>
    </article>
  );
}
