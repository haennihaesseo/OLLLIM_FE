import Image from "next/image";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  title?: string;
};

export function HomeHeader({ title = "" }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-5 px-5 py-[0.62rem]">
      {/* Left Logo */}
      <Image src="/logo.svg" alt="Logo" width={28} height={28} priority />

      {/* Center Title */}
      <h1 className="typo-body1-lg">{title}</h1>

      {/* Right Exit (Client) */}
      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
        로그인
      </Button>
    </header>
  );
}
