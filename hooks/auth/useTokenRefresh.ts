import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { accessTokenAtom, refreshTokenStorage } from "@/store/auth";
import useGetTokenReissue from "@/hooks/apis/get/useGetTokenReissue";

/**
 * refreshToken으로 accessToken을 자동으로 재발급하는 훅
 */
export function useTokenRefresh() {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const [refreshToken] = useState(() => refreshTokenStorage.get());

  const {
    data: tokenData,
    isSuccess,
    isError,
  } = useGetTokenReissue(refreshToken);

  // refreshToken으로 accessToken 재발급
  useEffect(() => {
    if (isSuccess && tokenData) {
      setAccessToken(tokenData.accessToken);
    }
  }, [isSuccess, tokenData, setAccessToken]);

  // refreshToken 만료 시 초기화
  useEffect(() => {
    if (isError) {
      refreshTokenStorage.clear();
      setAccessToken(null);
    }
  }, [isError, setAccessToken]);
}
