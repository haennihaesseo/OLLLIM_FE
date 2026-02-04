import { atomWithStorage } from "jotai/utils";

/**
 * 현재 작성 중인 편지의 ID를 관리하는 atom
 * 음성 녹음 후 API 응답에서 받아 설정됨
 */
export const letterIdAtom = atomWithStorage<string | null>("letterId", null);
