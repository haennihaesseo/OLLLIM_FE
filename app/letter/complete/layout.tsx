import { HomeHeader } from "@/components/home/HomeHeader";

export default function LetterCompleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh flex flex-col">
      <HomeHeader />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
