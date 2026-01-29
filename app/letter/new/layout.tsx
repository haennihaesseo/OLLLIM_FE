import { LetterNewHeader } from "@/components/letter/LetterNewHeader";

export default function LetterNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh flex flex-col">
      <LetterNewHeader />

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
