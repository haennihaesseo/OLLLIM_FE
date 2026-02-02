import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, LetterVoiceResponse } from "@/types/letter";

export function useGetLetterVoice(letterId: string | null) {
  return useQuery({
    queryKey: ["letterVoice", letterId],
    queryFn: async () => {
      const response = await client.get<ApiResponse<LetterVoiceResponse>>(
        "/api/letter/voice",
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
