import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/letter";

type PatchLetterData = {
  title: string;
  sender: string;
  content: string;
};

export function usePatchLetter(letterId: string) {
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
    onError: (error) => {
      console.error("편지 저장 실패:", error);
      // 에러 처리 필요시 추가
    },
  });
}
