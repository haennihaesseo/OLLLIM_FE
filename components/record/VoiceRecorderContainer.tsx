"use client";

import { useMemo } from "react";
import WaveformCanvas from "./WaveformCanvas";
import WaveformController from "./WaveformController";
import RecordingTimer from "./RecordingTimer";
import { useRecordingSession } from "@/hooks/record/useRecordingSession";
import { useAudioPlayback } from "@/hooks/record/useAudioPlayback";
import { useWaveformControllerPreset } from "@/hooks/record/useWaveformControllerPreset";

export default function VoiceRecorderContainer() {
  //Recording FSM
  const {
    canvasRef,
    status: recordingStatus,
    audioBlob,
    recordingTime,
    start,
    pause,
    resume,
    stop,
    reset,
    updatePlaybackProgress,
  } = useRecordingSession();

  //Playback FSM
  const {
    status: playbackStatus,
    // audioUrl, // 필요하면 <audio>로도 쓸 수 있음 (우린 내부 Audio로 제어 중)
    // duration,
    currentTime,
    play,
    pause: pausePlayback,
    stop: stopPlayback,
    // seek,
  } = useAudioPlayback(audioBlob, updatePlaybackProgress);

  const canPlayback = recordingStatus === "stopped" && !!audioBlob;

  const preset = useWaveformControllerPreset({
    recordingStatus,
    actions: { start, pause, resume, stop, reset },
    playback: {
      canPlayback,
      playbackStatus,
      play,
      pausePlayback,
      stopPlayback,
    },
  });

  // 타이머 표시 로직
  const timerValue = useMemo(() => {
    // idle 상태: 타이머 숨김
    if (recordingStatus === "idle") {
      return null;
    }
    // 녹음 중이거나 일시정지 상태: 녹음 시간 표시
    if (recordingStatus === "recording" || recordingStatus === "paused") {
      return recordingTime;
    }
    // 녹음 완료 후 재생 중: 재생 시간 표시
    if (recordingStatus === "stopped" && playbackStatus === "playing") {
      return currentTime;
    }
    // 녹음 완료 후 재생 전: 00:00 표시
    return 0;
  }, [recordingStatus, recordingTime, playbackStatus, currentTime]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1">
            <WaveformCanvas canvasRef={canvasRef} />
          </div>
          <RecordingTimer timeInSeconds={timerValue} />
        </div>
        <WaveformController preset={preset} />
      </div>
    </div>
  );
}
