/**
 * 녹음 상태 타입
 * - idle: 녹음 시작 전
 * - recording: 녹음 중
 * - paused: 일시정지
 * - stopped: 녹음 완료
 */
export type RecordingStatus = "idle" | "recording" | "paused" | "stopped";

/**
 * 재생 상태 타입
 * - idle: 재생 전
 * - playing: 재생 중
 * - paused: 일시정지
 */
export type PlaybackStatus = "idle" | "playing" | "paused";

/**
 * 컨트롤 버튼 변형 타입
 */
export type ControlVariant =
  | "record"
  | "stop"
  | "pause"
  | "play"
  | "reset"
  | "disabled";

/**
 * 컨트롤 버튼 프리셋 타입
 */
export type ControlPreset = {
  variant: ControlVariant;
  ariaLabel: string;
  size?: "sm" | "md";
  onClick?: () => void;
  disabled?: boolean;
};
