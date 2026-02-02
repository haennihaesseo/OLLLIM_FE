import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { client } from "@/lib/axiosInstance";
import { getNextStep } from "@/lib/letterSteps";
import type { ApiResponse } from "@/types/letter";

type PatchLetterData = {
  title: string;
  sender: string;
  content: string;
};

export function usePatchLetter(letterId: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: PatchLetterData) => {
      const response = await client.patch<ApiResponse<null>>(
        "/api/letter",
        data,
        {
          headers: {
            letterId: letterId, 
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // /letter/new/edit 기준으로 다음 스텝 계산
      const basePathname = "/letter/new/edit";
      const nextStep = getNextStep(basePathname);

      if (nextStep) {
        router.push(`${nextStep}?letterId=${letterId}`);
      }
    },
    onError: (error) => {
      console.error("편지 저장 실패:", error);
      // 에러 처리 필요시 추가
    },
  });
}
