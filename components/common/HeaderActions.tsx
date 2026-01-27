"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderActionsProps = {
  onExit?: () => void;
  fallback?: "back" | "close";
};

export function HeaderActions({
  onExit,
  fallback = "back",
}: HeaderActionsProps) {
  const router = useRouter();

  const handleExit = () => {
    if (onExit) return onExit();
    if (fallback === "back") return router.back();
    router.push("/");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleExit}
      aria-label="닫기"
      className="size-6 p-0"
    >
      <X className="size-6" />
    </Button>
  );
}
