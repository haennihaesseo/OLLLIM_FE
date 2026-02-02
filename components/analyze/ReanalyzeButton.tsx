import { Button } from "../ui/button";
import { Undo2 } from "lucide-react";

export default function ReanalyzeButton() {
  return (
    <Button
      variant="outline"
      className="flex w-79 h-auto items-center justify-center gap-1 px-4 py-3 bg-white rounded-lg border border-solid border-gray-200"
    >
      <Undo2 className="w-5 h-5" />
      <span className="typo-h1-base text-black ">다시</span>
    </Button>
  );
}
