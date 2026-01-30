"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/axiosInstance";

type UseAudioWaveformAnalysisReturn = {
  levels: number[];
  duration: number;
  isLoading: boolean;
  error: string | null;
};

/**
 * RMS 계산 (Root Mean Square)
 * @param data Float32Array 오디오 샘플 데이터
 * @returns 0~1 사이의 RMS 값
 */
function computeRMS(data: Float32Array): number {
  let sumSquares = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    sumSquares += v * v;
  }
  return Math.sqrt(sumSquares / data.length);
}

/**
 * 오디오 파일을 분석하여 waveform levels를 생성합니다
 * @param audioUrl 오디오 파일 URL
 * @param sampleCount 생성할 샘플 개수 (기본값: 70)
 */
export function useAudioWaveformAnalysis(
  audioUrl: string | null,
  sampleCount = 70,
): UseAudioWaveformAnalysisReturn {
  const [levels, setLevels] = useState<number[]>([]);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioUrl) {
      setLevels([]);
      setDuration(0);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    let audioContext: AudioContext | null = null;

    const analyzeAudio = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 오디오 파일 fetch (axios 사용)
        const response = await client.get(audioUrl, {
          responseType: "arraybuffer",
          // withCredentials: false, // CORS 설정
        });

        const arrayBuffer = response.data;

        // AudioContext 생성 및 디코딩
        audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        if (isCancelled) return;

        // Duration 추출
        const audioDuration = audioBuffer.duration;
        setDuration(audioDuration);

        // 오디오 채널 데이터 가져오기 (첫 번째 채널 사용)
        const channelData = audioBuffer.getChannelData(0);
        const totalSamples = channelData.length;

        // 지정된 개수만큼 샘플링
        const samplesPerBucket = Math.floor(totalSamples / sampleCount);
        const waveformLevels: number[] = [];

        for (let i = 0; i < sampleCount; i++) {
          const start = i * samplesPerBucket;
          const end = Math.min(start + samplesPerBucket, totalSamples);
          const bucketData = channelData.slice(start, end);

          // RMS 계산
          const rms = computeRMS(bucketData);
          // 레벨 조정 (0~1 범위로 정규화, 약간 증폭)
          const level = Math.min(1, rms * 2.2);
          waveformLevels.push(level);
        }

        if (!isCancelled) {
          setLevels(waveformLevels);
          setIsLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to analyze audio";
          setError(errorMessage);
          setIsLoading(false);
        }
      } finally {
        // AudioContext 정리
        if (audioContext) {
          try {
            await audioContext.close();
          } catch {
            // ignore
          }
        }
      }
    };

    analyzeAudio();

    return () => {
      isCancelled = true;
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close().catch(() => {
          // ignore
        });
      }
    };
  }, [audioUrl, sampleCount]);

  return {
    levels,
    duration,
    isLoading,
    error,
  };
}
