import { Header } from "@/components/common/Header";
import { Progress } from "@/components/ui/progress";

export default function LetterNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh flex flex-col">
      {/* Header */}
      <Header title="목소리 담기" />

      {/* Progress */}
      <section className="px-5 pt-2.5">
        <Progress
          value={50}
          className="bg-gray-300 rounded-full h-1"
          indicatorClassName="bg-gray-500"
        />
      </section>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
