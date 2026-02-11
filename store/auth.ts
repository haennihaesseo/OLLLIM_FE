import { atom } from "jotai";

export const accessTokenAtom = atom<string | null>(null);

// 로그인 여부를 확인하는 파생 atom
export const isLoggedInAtom = atom((get) => {
  const accessToken = get(accessTokenAtom);
  return accessToken !== null && accessToken !== "";
});

// 인증 상태 로딩 중 여부 (refreshToken은 있지만 accessToken이 아직 없는 상태)
export const isAuthLoadingAtom = atom((get) => {
  const accessToken = get(accessTokenAtom);
  if (accessToken !== null) return false;
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("refreshToken") !== null;
});

const REFRESH_KEY = "refreshToken";

export const refreshTokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(REFRESH_KEY);
  },
  set(token: string) {
    sessionStorage.setItem(REFRESH_KEY, token);
  },
  clear() {
    sessionStorage.removeItem(REFRESH_KEY);
  },
};
