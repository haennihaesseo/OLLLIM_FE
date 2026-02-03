import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { letterIdAtom } from "@/store/letterAtoms";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, LetterFontResponse } from "@/types/letter";

export function useGetLetterFont(enabled: boolean = true) {
  const [letterId] = useAtom(letterIdAtom);

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
