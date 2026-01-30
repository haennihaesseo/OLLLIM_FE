import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { recordingStatusAtom } from "@/store/recordingAtoms";

export type PlaybackStatus = "idle" | "playing" | "paused";

/**
 * 녹음/재생 상태에 따른 타이머 값을 계산하는 훅
 *
 * @param recordingTime - 현재 녹음 시간 (초)
 * @param playbackStatus - 재생 상태
 * @param currentTime - 현재 재생 시간 (초)
 * @returns 표시할 타이머 값 (초) 또는 null (타이머 숨김)
 */
export function useRecordingTimer(params: {
  recordingTime: number;
  playbackStatus: PlaybackStatus;
  currentTime: number;
}) {
  const { recordingTime, playbackStatus, currentTime } = params;
  const recordingStatus = useAtomValue(recordingStatusAtom);

  return useMemo(() => {
    // idle 상태: 타이머 숨김
    if (recordingStatus === "idle") {
      return null;
    }

    // 녹음 중이거나 일시정지 상태: 녹음 시간 표시
    if (recordingStatus === "recording" || recordingStatus === "paused") {
      return recordingTime;
    }

    // 녹음 완료 후 재생 중/일시정지: 재생 시간 표시
    if (recordingStatus === "stopped" && playbackStatus !== "idle") {
      return currentTime;
    }

    // 녹음 완료 후 재생 전: 00:00 표시
    return 0;
  }, [recordingStatus, recordingTime, playbackStatus, currentTime]);
}
