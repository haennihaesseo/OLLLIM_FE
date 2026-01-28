"use client";

import WaveformCanvas from "./WaveformCanvas";
import WaveformController from "./WaveformController";
import { useRecordingSession } from "hooks/record/useRecordingSession";
import { useAudioPlayback } from "hooks/record/useAudioPlayback";
import { useWaveformControllerPreset } from "hooks/record/useWaveformControllerPreset";

export default function VoiceRecorderContainer() {
  //Recording FSM
  const {
    canvasRef,
    status: recordingStatus,
    audioBlob,
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
    // currentTime,
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

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <WaveformCanvas canvasRef={canvasRef} />
        <WaveformController preset={preset} />
      </div>
    </div>
  );
}
