"use client";

import { LetterEditor } from "./LetterEditor";
import { VoicePlayer } from "./VoicePlayer";

// Mock 데이터 (추후 API로 교체)
const mockLetterData = {
  voiceUrl:
    "https://sandoll-s3-bucket.s3.ap-northeast-2.amazonaws.com/voice/33a4ed19-02d8-47a6-a318-1034ecc0a5a3_recording.webm",
  duration: 60,
  fontId: 1,
  fontName: "Sandoll 고딕Neo1",
  content: "안녕 생일 축하해! 항상 고마워.",
  title: "생일 축하 편지",
  sender: "세여니",
  bgmUrl: null,
  templateUrl:
    "https://sandoll-s3-bucket.s3.ap-northeast-2.amazonaws.com/template/%E1%84%86%E1%85%AE%E1%84%8C%E1%85%B5.png",
  words: [
    { word: "안녕", startTime: 0.001, endTime: 1.288 },
    { word: "생일", startTime: 1.3, endTime: 1.488 },
    { word: "축하해!", startTime: null, endTime: null },
    { word: "항상", startTime: 2.288, endTime: 4.288 },
    { word: "고마워", startTime: 4.288, endTime: 6.288 },
  ],
};

export function LetterEditContainer() {
  // TODO: API 연동 시 여기서 데이터를 fetch
  // const { data, isLoading, error } = useLetterData(letterId);

  return (
    <section className="flex flex-col p-5 gap-4">
      <LetterEditor />
      <VoicePlayer audioUrl={mockLetterData.voiceUrl} />
    </section>
  );
}
