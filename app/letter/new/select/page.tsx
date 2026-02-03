"use client";

import { useGetLetterData } from "@/hooks/apis/get/useGetLetterData";

export default function SelectPage() {
  const { data } = useGetLetterData();
  console.log(data);

  if (!data) return null;
  return (
    <div>
      <h1>Select Page</h1>
    </div>
  );
}
