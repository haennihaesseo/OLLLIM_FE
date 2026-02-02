import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { letterIdAtom } from "@/store/letterAtoms";
import { client } from "@/lib/axiosInstance";
import { getNextStep } from "@/lib/letterSteps";
import type { ApiResponse, VoiceUploadResponse } from "@/types/letter";

export function usePostLetterVoice() {
  const router = useRouter();
  const setLetterId = useSetAtom(letterIdAtom);

  return useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append("voice", audioBlob, "recording.webm");
      const response = await client.post<ApiResponse<VoiceUploadResponse>>(
        "/api/letter/voice",
        formData
      );
      return response.data;
    },
    onSuccess: (data) => {
      const { letterId } = data.data;
      // letterId를 atom에 저장
      setLetterId(letterId);
      // /letter/new/record 기준으로 다음 스텝 계산
      const basePathname = "/letter/new/record";
      const nextStep = getNextStep(basePathname);

      if (nextStep) {
        router.push(nextStep);
      }
    },
    onError: (error) => {
      console.error("음성 업로드 실패:", error);
      // 에러 시 record 페이지로 복귀
      router.push("/letter/new/record");
    },
  });
}
