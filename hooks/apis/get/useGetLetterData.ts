import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, LetterData } from "@/types/letter";

export function useGetLetterData(letterId: string | null) {
  return useQuery({
    queryKey: ["letter", letterId],
    queryFn: async () => {
      // letterId를 헤더에 담아서 요청
      const response = await client.get<ApiResponse<LetterData>>(
        "/api/letter/content",
        {
          headers: {
            letterId: letterId,
          },
        },
      );
      return response.data.data;
    },
    enabled: !!letterId,
  });
}
