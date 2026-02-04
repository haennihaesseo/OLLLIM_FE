"use client";

import { useTmpKeyLogin } from "@/hooks/auth/useTmpKeyLogin";
import { useTokenRefresh } from "@/hooks/auth/useTokenRefresh";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // tmpKey로 자동 로그인 처리
  useTmpKeyLogin();

  // refreshToken으로 accessToken 자동 재발급
  useTokenRefresh();

  return <>{children}</>;
}
