"use client";

import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { accessTokenAtom, refreshTokenStorage } from "@/store/auth";
import useGetTokenReissue from "@/hooks/apis/get/useGetTokenReissue";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const [refreshToken] = useState(() => refreshTokenStorage.get());
  
  const { data: tokenData, isSuccess, isError } = useGetTokenReissue(refreshToken);

  useEffect(() => {
    if (isSuccess && tokenData) {
      // accessToken 재발급 성공
      setAccessToken(tokenData.accessToken);
    }
  }, [isSuccess, tokenData, setAccessToken]);

  useEffect(() => {
    if (isError) {
      // refreshToken이 만료되었거나 유효하지 않은 경우 초기화
      refreshTokenStorage.clear();
      setAccessToken(null);
    }
  }, [isError, setAccessToken]);

  return <>{children}</>;
}
