"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/store/auth";
import { Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type HeaderProps = {
  title?: string;
};

export function HomeHeader({ title = "" }: HeaderProps) {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const router = useRouter();
  const pathname = usePathname();
  const handleLogin = () => {
    router.push(`/login?redirectUrl=${pathname}`);
  };

  return (
    <header className="flex items-center justify-between gap-5 px-5 py-2 h-13">
      {/* Left Logo */}
      <Link href="/">
        <Image src="/logo.svg" alt="Logo" width={28} height={28} priority />
      </Link>
      {/* Center Title */}
      <h1 className="typo-body1-lg">{title}</h1>
      {/* Right Login (Client) */}
      {isLoggedIn ? (
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <Settings size={20} className="text-gray-900" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10"
          onClick={handleLogin}
        >
          로그인
        </Button>
      )}
    </header>
  );
}
