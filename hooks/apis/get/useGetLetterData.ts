import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { letterIdAtom } from "@/store/letterAtoms";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, LetterData } from "@/types/letter";

export function useGetLetterData() {
  const [letterId] = useAtom(letterIdAtom);

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

export function useSuspenseLetterData() {
  const [letterId] = useAtom(letterIdAtom);

  return useSuspenseQuery({
    queryKey: ["letter", letterId],
    queryFn: async () => {
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
  });
}
