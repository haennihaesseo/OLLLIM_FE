"use client";

import { useEffect } from "react";

/**
 * 동적으로 TTF 폰트를 로드하고 font-family 이름을 반환하는 훅
 * @param fontId - 폰트 고유 ID
 * @param fontUrl - TTF 폰트 파일 URL
 * @returns font-family 이름
 */
export function useDynamicFont(fontId: number, fontUrl: string): string {
  const fontFamilyName = `ollim-font-${fontId}`;

  useEffect(() => {
    const styleId = `font-face-${fontId}`;

    // 이미 로드된 경우 스킵
    if (document.getElementById(styleId)) {
      return;
    }

    const styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    styleSheet.textContent = `
      @font-face {
        font-family: '${fontFamilyName}';
        src: url('${fontUrl}') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;

    document.head.appendChild(styleSheet);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [fontId, fontUrl, fontFamilyName]);

  return fontFamilyName;
}

/**
 * 여러 폰트를 한번에 로드하는 훅
 * @param fonts - 폰트 정보 배열
 * @returns fontId -> font-family 이름 매핑
 */
export function useDynamicFonts(
  fonts: Array<{ fontId: number; fontUrl: string }>
): Map<number, string> {
  useEffect(() => {
    const styleId = "font-faces-batch";

    // 이미 로드된 경우 스킵
    if (document.getElementById(styleId)) {
      return;
    }

    const fontFaces = fonts
      .map(
        ({ fontId, fontUrl }) => `
        @font-face {
          font-family: 'ollim-font-${fontId}';
          src: url('${fontUrl}') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `
      )
      .join("\n");

    const styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    styleSheet.textContent = fontFaces;
    document.head.appendChild(styleSheet);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [fonts]);

  return new Map(
    fonts.map(({ fontId }) => [fontId, `ollim-font-${fontId}`])
  );
}
