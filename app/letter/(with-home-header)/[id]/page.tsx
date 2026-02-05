"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePostLetterView } from "@/hooks/apis/post/usePostLetterView";
import LetterLoading from "./loading";
import Image from "next/image";
import CompleteButton from "@/components/common/CompleteButton";

export default function LetterPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const { mutate, data, isPending, isError, error } = usePostLetterView();

  useEffect(() => {
    mutate({
      secretLetterId: id,
      password: null,
    });
  }, [id, mutate]);

  if (!data) return <LetterLoading />;

  switch (isLetterOpen) {
    case true:
      return <article></article>;
    default:
      return (
        <article className="h-full px-5">
          <div className="flex flex-col items-center justify-center h-[75%] gap-3">
            <Image
              src="/gif/receive-motion.gif"
              alt="receive-motion"
              width={100}
              height={100}
              unoptimized
            />
            <h1 className="typo-h2-3xl text-gray-900">
              {data.data.sender}님으로부터 온 올림레터
            </h1>
          </div>
          <CompleteButton
            onClick={() => setIsLetterOpen(true)}
            disabled={isPending}
            title="열어 보기"
          />
        </article>
      );
  }
}
