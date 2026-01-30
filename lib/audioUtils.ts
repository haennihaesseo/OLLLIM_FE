/**
 * 오디오 처리 관련 유틸리티 함수 모음
 */

/**
 * Float32Array 데이터로부터 RMS (Root Mean Square) 값을 계산합니다.
 * @param data Float32Array 오디오 샘플 데이터
 * @returns 0~1 사이의 RMS 값
 */
export function computeRMSFromFloat32(data: Float32Array): number {
  let sumSquares = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    sumSquares += v * v;
  }
  return Math.sqrt(sumSquares / data.length);
}

/**
 * Uint8Array 데이터로부터 RMS (Root Mean Square) 값을 계산합니다.
 * @param data Uint8Array 오디오 샘플 데이터 (0~255 범위)
 * @returns 0~1 사이의 RMS 값
 */
export function computeRMSFromUint8(data: Uint8Array): number {
  let sumSquares = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (data[i] - 128) / 128; // -1~1 범위로 정규화
    sumSquares += v * v;
  }
  return Math.sqrt(sumSquares / data.length);
}
