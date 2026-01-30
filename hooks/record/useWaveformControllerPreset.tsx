import { useMemo } from "react";
import { useAtomValue } from "jotai";
import type React from "react";
import { recordingStatusAtom } from "@/store/recordingAtoms";

export type Status = "idle" | "recording" | "paused" | "stopped";
export type PlaybackStatus = "idle" | "playing" | "paused";

export type ControlVariant =
  | "record"
  | "stop"
  | "pause"
  | "play"
  | "reset"
  | "disabled";

export type ControlPreset = {
  variant: ControlVariant;
  ariaLabel: string;
  size?: "sm" | "md";
  onClick?: () => void;
  disabled?: boolean;
};

type ActionKey = "start" | "pause" | "resume" | "stop" | "reset";

function buildPreset(args: {
  status: Status;
  actions: Record<ActionKey, () => void>;
  playback: {
    canPlayback: boolean;
    playbackStatus: PlaybackStatus;
    play: () => void;
    pausePlayback: () => void;
    stopPlayback: () => void;
  };
}): {
  message: React.ReactNode;
  left: ControlPreset;
  main: ControlPreset;
  right: ControlPreset;
} {
  const { status, actions, playback } = args;

  const disabledBtn: ControlPreset = {
    variant: "disabled",
    ariaLabel: "비활성 버튼",
    disabled: true,
  };

  switch (status) {
    case "idle":
      return {
        message: (
          <>
            마이크를 눌러 <br />
            목소리를 담아 보세요
          </>
        ),
        left: disabledBtn,
        main: {
          variant: "record",
          ariaLabel: "녹음 시작",
          size: "sm",
          onClick: actions.start,
        },
        right: disabledBtn,
      };

    case "recording":
      return {
        message: <>목소리 담는 중...</>,
        left: {
          variant: "pause",
          ariaLabel: "녹음 일시정지",
          size: "sm",
          onClick: actions.pause,
        },
        main: {
          variant: "stop",
          ariaLabel: "녹음 중지",
          size: "md",
          onClick: actions.stop,
        },
        right: {
          variant: "reset",
          ariaLabel: "녹음 취소(초기화)",
          size: "sm",
          onClick: actions.reset,
        },
      };

    case "paused":
      return {
        message: <>일시정지</>,
        left: {
          variant: "record",
          ariaLabel: "녹음 재개",
          size: "md",
          onClick: actions.resume,
        },
        main: {
          variant: "stop",
          ariaLabel: "녹음 중지",
          size: "sm",
          onClick: actions.stop,
        },
        right: {
          variant: "reset",
          ariaLabel: "녹음 취소(초기화)",
          size: "sm",
          onClick: actions.reset,
        },
      };

    case "stopped":
      if (playback.canPlayback) {
        return {
          message: <>목소리 듣기</>,
          left: disabledBtn,
          main:
            playback.playbackStatus === "playing"
              ? {
                  variant: "pause",
                  ariaLabel: "재생 일시정지",
                  size: "md",
                  onClick: playback.pausePlayback,
                }
              : {
                  variant: "play",
                  ariaLabel: "재생",
                  size: "md",
                  onClick: playback.play,
                },
          right: {
            variant: "reset",
            ariaLabel: "초기화",
            size: "sm",
            onClick: actions.reset,
          },
        };
      }

      return {
        message: <>목소리 듣기</>,
        left: disabledBtn,
        main: {
          variant: "record",
          ariaLabel: "다시 녹음 시작",
          size: "md",
          onClick: actions.start,
        },
        right: {
          variant: "reset",
          ariaLabel: "초기화",
          size: "sm",
          onClick: actions.reset,
        },
      };
  }
}

export function useWaveformControllerPreset(params: {
  actions: Record<ActionKey, () => void>;
  playback: {
    canPlayback: boolean;
    playbackStatus: PlaybackStatus;
    play: () => void;
    pausePlayback: () => void;
    stopPlayback: () => void;
  };
}) {
  const { actions, playback } = params;
  const recordingStatus = useAtomValue(recordingStatusAtom);

  return useMemo(
    () =>
      buildPreset({
        status: recordingStatus,
        actions,
        playback,
      }),
    [recordingStatus, actions, playback],
  );
}
