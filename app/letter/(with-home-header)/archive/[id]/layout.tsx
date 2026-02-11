import { Suspense } from "react";
import PageLoading from "@/components/common/PageLoading";

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<PageLoading title="편지 불러오는 중..." />}>{children}</Suspense>;
}
