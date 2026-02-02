import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, FontRefreshResponse } from "@/types/letter";

export function usePostFontRefresh(letterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await client.post<ApiResponse<FontRefreshResponse>>(
        "/api/letter/font/refresh",
        {},
        {
          headers: {
            letterId: letterId,
          },
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      // 폰트 데이터 자동 업데이트를 위해 query invalidation
      queryClient.invalidateQueries({
        queryKey: ["letterFont", letterId],
      });
    },
  });
}
