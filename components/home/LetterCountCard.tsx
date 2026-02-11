"use client";

import { Archive, Pencil } from "lucide-react";
import Link from "next/link";
import { useGetLetterCount } from "@/hooks/apis/get/useGetLetterCount";
import { useAtomValue } from "jotai";
import { isLoggedInAtom, isAuthLoadingAtom } from "@/store/auth";

export function LetterCountCard() {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const isAuthLoading = useAtomValue(isAuthLoadingAtom);
  const { data: letterCount, isLoading } = useGetLetterCount();

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex flex-col w-full items-start justify-center gap-2 border-gray-300 border rounded-lg p-5 shadow-md animate-pulse">
        <div className="w-8 h-8 bg-gray-200 rounded" />
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <Link
        href="/letter/archive"
        className="flex flex-col w-full items-start justify-center gap-2 bg-white border-gray-300 border rounded-lg px-5 py-5 shadow-md"
      >
        <Archive size={32} className="text-primary-700" />
        <div className="flex items-center justify-between gap-2 w-full">
          <h3 className="typo-h2-lg text-gray-900 ">편지함</h3>
          <p className="typo-body1-sm text-gray-500">
            {letterCount?.count}개 보관중
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div className="flex flex-col w-full items-start justify-center gap-2 border-gray-300 border rounded-lg p-5 shadow-md">
      <Pencil size={28} className="text-primary-700" />
      <div className="flex items-center justify-between gap-2 w-full">
        <h3 className="typo-h2-lg text-gray-900">
          지금까지 올림을 통해 보내진 편지
        </h3>
        <p className="typo-h2-2xl text-primary-700">
          {letterCount?.count ? letterCount.count : 0}개
        </p>
      </div>
    </div>
  );
}
