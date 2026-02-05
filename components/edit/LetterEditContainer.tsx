"use client";

import { useState } from "react";
import { LetterEditor } from "./LetterEditor";
import { VoicePlayer } from "./VoicePlayer";
import CompleteButtonContainer from "./CompleteButtonContainer";

interface LetterEditContainerProps {
  initialData: {
    content: string;
    voiceUrl: string;
  };
}

export function LetterEditContainer({ initialData }: LetterEditContainerProps) {
  const [title, setTitle] = useState("");
  const [sender, setSender] = useState("");
  const [content, setContent] = useState(initialData.content);

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
        <VoicePlayer audioUrl={initialData.voiceUrl} />
        <CompleteButtonContainer
          title={title}
          sender={sender}
          content={content}
        />
      </section>
    </article>
  );
}
