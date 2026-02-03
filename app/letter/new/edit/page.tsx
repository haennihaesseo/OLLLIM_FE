"use client";

import { useGetLetterData } from "@/hooks/apis/get/useGetLetterData";
import { LetterEditContainer } from "@/components/edit/LetterEditContainer";

export default function EditPage() {
  const { data } = useGetLetterData();

  if (!data) return null;

  return (
    <article className="bg-gray-50 h-full">
      <LetterEditContainer initialData={data} />
    </article>
  );
}
