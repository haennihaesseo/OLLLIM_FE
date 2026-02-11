import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { letterIdAtom } from "@/store/letterAtoms";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, LetterVoiceResponse } from "@/types/letter";

export function useGetLetterVoice() {
  const [letterId] = useAtom(letterIdAtom);

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

export function useSuspenseLetterVoice() {
  const [letterId] = useAtom(letterIdAtom);

  return useSuspenseQuery({
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
  });
}
