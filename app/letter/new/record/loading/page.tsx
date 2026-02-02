export default function RecordLoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      <p className="text-gray-600 text-center">음성을 업로드하는 중입니다...</p>
    </div>
  );
}
