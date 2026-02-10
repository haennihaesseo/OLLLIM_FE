import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { letterIdAtom } from "@/store/letterAtoms";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, LetterFontResponse } from "@/types/letter";

export function useGetLetterFont(
  type: "CONTEXT" | "VOICE" = "VOICE",
  options?: { enabled?: boolean }
) {
  const [letterId] = useAtom(letterIdAtom);

  return useQuery({
    queryKey: ["letterFont", letterId, type],
    queryFn: async () => {
      const response = await client.get<ApiResponse<LetterFontResponse>>(
        `/api/letter/font?type=${type}`,
        {
          headers: {
            letterId: letterId,
          },
        }
      );
      return response.data.data;
    },
    enabled: !!letterId && (options?.enabled ?? true),
  });
}
