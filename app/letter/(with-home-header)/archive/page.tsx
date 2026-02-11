"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetReceivedLetter } from "@/hooks/apis/get/useGetReceivedLetter";
import { useGetSentLetter } from "@/hooks/apis/get/useGetSentLetter";
import { Archive } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LetterListItem } from "@/components/archive/LetterListItem";

export default function ArchivePage() {
  const [tabType, setTabType] = useState("received");
  const tabs = [
    {
      value: "received",
      label: "받은 편지",
    },
    {
      value: "sent",
      label: "보낸 편지",
    },
  ];

  const { data: receivedLetter } = useGetReceivedLetter();
  const { data: sentLetter } = useGetSentLetter();

  // 편지 목록 보기 상태일 때
  return (
    <article className="flex flex-col h-full px-5">
      <header className="flex gap-2 items-center shrink-0">
        <Archive size={28} />
        <h1 className="typo-h2-3xl text-gray-900">편지함</h1>
      </header>
      <section className="flex flex-col w-full mt-5 min-h-0 flex-1">
        <Tabs
          value={tabType}
          onValueChange={setTabType}
          className="w-full h-10.5 shrink-0"
        >
          <TabsList className="w-full rounded-full h-10.5">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="typo-body1-md rounded-full
                data-[state=active]:bg-primary-700 data-[state=active]:text-white
                data-[state=inactive]:text-gray-500"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="px-2 flex-1 min-h-0 overflow-y-auto mb-30">
          {tabType === "received" ? (
            <div className="w-full">
              {receivedLetter && receivedLetter.length > 0 ? (
                receivedLetter.map((letter) => (
                  <LetterListItem
                    key={letter.letterId}
                    letter={letter}
                    isSent={false}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  받은 편지가 없습니다
                </p>
              )}
            </div>
          ) : (
            <div className="w-full">
              {sentLetter && sentLetter.length > 0 ? (
                sentLetter.map((letter) => (
                  <LetterListItem
                    key={letter.letterId}
                    letter={letter}
                    isSent={true}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  보낸 편지가 없습니다
                </p>
              )}
            </div>
          )}
        </div>
        <Button className="fixed lg:w-95 bottom-15 left-0 right-0 w-[90%] mx-auto h-11.5 bg-[#E6002314] border-primary-700 border text-primary-700 typo-h1-base">
          <Link href="/letter/new/record">편지 작성하기</Link>
        </Button>
      </section>
    </article>
  );
}
