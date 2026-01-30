import { atom } from "jotai";
import type { RecordingStatus } from "@/types/recording";

/**
 * 녹음 상태를 관리하는 atom
 * idle: 녹음 시작 전
 * recording: 녹음 중
 * paused: 일시정지
 * stopped: 녹음 완료
 */
export const recordingStatusAtom = atom<RecordingStatus>("idle");

/**
 * 저장된 오디오 Blob을 관리하는 atom
 * 녹음 완료 후 생성된 오디오 파일
 */
export const audioBlobAtom = atom<Blob | null>(null);
