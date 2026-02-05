"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive } from "lucide-react";
import { useState } from "react";

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
  return (
    <article className="flex flex-col items-start justify-center px-5">
      <header className="flex gap-2 items-center">
        <Archive size={28} />
        <h1 className="typo-h2-3xl text-gray-900">올림 보관함</h1>
      </header>
      <section className="w-full mt-5">
        <Tabs
          value={tabType}
          onValueChange={setTabType}
          className="w-full h-10.5"
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
      </section>
    </article>
  );
}
