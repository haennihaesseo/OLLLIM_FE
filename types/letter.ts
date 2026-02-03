/**
 * 단어 타이밍 정보
 */
export type Word = {
  word: string;
  startTime: number | null;
  endTime: number | null;
};

/**
 * 편지 데이터 타입 (GET /api/letter 응답)
 */
export type LetterData = {
  voiceUrl: string;
  duration: number;
  fontId: number;
  fontName: string;
  content: string;
  title: string;
  sender: string;
  bgmUrl: string | null;
  templateUrl: string;
  words: Word[];
};

/**
 * 음성 업로드 응답 타입 (POST /api/letter/voice 응답)
 */
export type VoiceUploadResponse = {
  letterId: string;
  voiceUrl: string;
  duration: number;
  content: string;
};

/**
 * 폰트 정보 타입
 */
export type FontInfo = {
  fontId: number;
  name: string;
  fontUrl: string;
  keywords?: string[];
};

/**
 * 목소리 분석 응답 타입 (GET /api/letter/voice 응답)
 */
export type LetterVoiceResponse = {
  result: string;
  fonts: FontInfo[];
};

/**
 * 추천 폰트 리스트 응답 타입 (GET /api/letter/font 응답)
 */
export type LetterFontResponse = {
  voiceFonts: FontInfo[];
  contextFonts: FontInfo[];
};

/**
 * 폰트 새로고침 응답 타입 (POST /api/letter/font/refresh 응답)
 */
export type FontRefreshResponse = {
  type?: string;
  fonts: FontInfo[];
};

/**
 * API 공통 응답 래퍼
 */
export type ApiResponse<T> = {
  success: boolean;
  status: number;
  message: string;
  code: string;
  data: T;
  timestamp: string;
};
