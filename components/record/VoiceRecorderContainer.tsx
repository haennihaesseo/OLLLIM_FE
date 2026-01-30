"use client";

import { useAtomValue } from "jotai";
import WaveformCanvas from "./WaveformCanvas";
import WaveformController from "./WaveformController";
import RecordingTimer from "./RecordingTimer";
import { useRecordingSession } from "@/hooks/record/useRecordingSession";
import { useAudioPlayback } from "@/hooks/record/useAudioPlayback";
import { useWaveformControllerPreset } from "@/hooks/record/useWaveformControllerPreset";
import { useRecordingTimer } from "@/hooks/record/useRecordingTimer";
import { recordingStatusAtom, audioBlobAtom } from "@/store/recordingAtoms";

export default function VoiceRecorderContainer() {
  // 전역 상태 구독
  const recordingStatus = useAtomValue(recordingStatusAtom);
  const audioBlob = useAtomValue(audioBlobAtom);

  //Recording FSM
  const {
    canvasRef,
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
    currentTime,
    play,
    pause: pausePlayback,
    stop: stopPlayback,
  } = useAudioPlayback(audioBlob, updatePlaybackProgress);

  const canPlayback = recordingStatus === "stopped" && !!audioBlob;

  const preset = useWaveformControllerPreset({
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
  const timerValue = useRecordingTimer({
    recordingTime,
    playbackStatus,
    currentTime,
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center w-full">
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
