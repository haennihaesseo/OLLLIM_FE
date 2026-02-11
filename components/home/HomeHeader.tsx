"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAtom, useSetAtom } from "jotai";
import {
  isLoggedInAtom,
  accessTokenAtom,
  refreshTokenStorage,
} from "@/store/auth";
import { Settings, Bell, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePostLogout } from "@/hooks/apis/post/usePostLogout";

type HeaderProps = {
  title?: string;
};

export function HomeHeader({ title = "" }: HeaderProps) {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const setAccessToken = useSetAtom(accessTokenAtom);
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { mutate: logout } = usePostLogout();

  const handleLogin = () => {
    router.push(`/login?redirectUrl=${pathname}`);
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    // 토큰 초기화
    setAccessToken(null);
    refreshTokenStorage.clear();
    setIsOpen(false);
    setIsLogoutDialogOpen(false);
    router.push("/");
  };

  const handleLogoutCancel = () => {
    setIsLogoutDialogOpen(false);
  };

  return (
    <>
      <header className="flex items-center justify-between gap-5 px-5 py-2 h-13">
        {/* Left Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={28} height={28} priority />
        </Link>
        {/* Center Title */}
        <h1 className="typo-body1-lg">{title}</h1>
        {/* Right Side */}
        {isLoggedIn ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="cursor-pointer">
                <Settings size={24} className="text-gray-900" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-50">
              <div className="flex flex-col gap-2 mt-10 px-2">
                <button
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <Bell size={20} className="text-gray-700" />
                  <span className="text-base">공지사항</span>
                </button>

                <button
                  className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-primary-700"
                  onClick={handleLogoutClick}
                >
                  <LogOut size={20} />
                  <span className="text-base">로그아웃</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
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

      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent className="w-[90%] max-w-sm rounded-2xl p-6">
          <AlertDialogTitle className="typo-body1-md text-gray-900 text-center">
            로그아웃 하시겠습니까?
          </AlertDialogTitle>
          <AlertDialogFooter className="flex-row gap-2 mt-4">
            <AlertDialogCancel
              onClick={handleLogoutCancel}
              className="mt-0 flex-1 h-12 rounded-lg typo-body1-base border-gray-200"
            >
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="flex-1 h-12 rounded-lg typo-body1-base bg-primary-700 hover:bg-primary-800"
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
