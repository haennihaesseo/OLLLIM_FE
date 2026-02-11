import { Spinner } from "@/components/ui/spinner";

interface PageLoadingProps {
  title?: string;
}

export default function PageLoading({ title }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[80%] gap-4">
      {title && (
        <p className="text-gray-400 text-center typo-h2-lg whitespace-pre-line">
          {title}
        </p>
      )}
      <Spinner className="size-12 text-gray-400" />
    </div>
  );
}
