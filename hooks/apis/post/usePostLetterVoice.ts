import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { letterIdAtom } from "@/store/letterAtoms";
import { client } from "@/lib/axiosInstance";
import { getNextStep } from "@/lib/letterSteps";
import type { ApiResponse, VoiceUploadResponse } from "@/types/letter";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function usePostLetterVoice() {
  const router = useRouter();
  const setLetterId = useSetAtom(letterIdAtom);

  return useMutation({
    mutationFn: async ({
      audioBlob,
      duration,
    }: {
      audioBlob: Blob;
      duration: number;
    }) => {
      const formData = new FormData();
      formData.append("voice", audioBlob, "recording.webm");
      const response = await client.post<ApiResponse<VoiceUploadResponse>>(
        `/api/letter/voice?duration=${duration}`,
        formData,
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
      const errorCode = (error as AxiosError<ApiResponse<VoiceUploadResponse>>)
        .response?.data.code;
      if (errorCode === "TOO_SHORT_CONTENT") {
        toast.error("녹음된 내용이 너무 짧습니다. 다시 녹음해주세요.");
      } else if (errorCode === "TOO_LONG_CONTENT") {
        toast.error(
          "녹음된 내용이 너무 길어 편지 작성이 불가능합니다. 다시 녹음해주세요.",
        );
      } else if (errorCode === "PAYLOAD_TOO_LARGE") {
        toast.error("파일 크기가 너무 큽니다. 다시 녹음해주세요.");
      } else {
        toast.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    },
  });
}
