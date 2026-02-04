import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { accessTokenAtom, refreshTokenStorage } from "@/store/auth";
import useGetToken from "@/hooks/apis/get/useGetToken";

/**
 * URL query string의 tmpKey로 자동 로그인을 처리하는 훅
 */
export function useTmpKeyLogin() {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tmpKey = searchParams.get("tmpKey");

  const { data: tmpKeyTokenData, isSuccess: isTmpKeySuccess } = useGetToken(
    tmpKey ?? ""
  );

  // tmpKey로 로그인 처리
  useEffect(() => {
    if (isTmpKeySuccess && tmpKeyTokenData && tmpKey) {
      // 토큰 저장
      setAccessToken(tmpKeyTokenData.accessToken);
      refreshTokenStorage.set(tmpKeyTokenData.refreshToken);

      // URL에서 tmpKey 파라미터 제거
      const params = new URLSearchParams(searchParams.toString());
      params.delete("tmpKey");
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl);
    }
  }, [
    isTmpKeySuccess,
    tmpKeyTokenData,
    tmpKey,
    setAccessToken,
    router,
    pathname,
    searchParams,
  ]);
}
