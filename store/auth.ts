import { atom } from "jotai";

export const accessTokenAtom = atom<string | null>(null);

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
