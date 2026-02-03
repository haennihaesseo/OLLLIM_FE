import { Spinner } from "@/components/ui/spinner";

export default function RecordLoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80%] gap-4">
      <p className="text-gray-400 text-center typo-h2-lg">
        목소리에서
        <br />
        내용 추출 중...
      </p>
      <Spinner className="size-12 text-gray-400" />
    </div>
  );
}
