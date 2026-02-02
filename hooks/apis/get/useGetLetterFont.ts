import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, LetterFontResponse } from "@/types/letter";

export function useGetLetterFont(letterId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["letterFont", letterId],
    queryFn: async () => {
      const response = await client.get<ApiResponse<LetterFontResponse>>(
        "/api/letter/font",
        {
          headers: {
            letterId: letterId,
          },
        }
      );
      return response.data.data;
    },
    enabled: !!letterId && enabled,
  });
}
