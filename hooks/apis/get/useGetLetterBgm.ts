import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { letterIdAtom } from "@/store/letterAtoms";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, LetterBgmResponse } from "@/types/letter";

export function useGetLetterBgm(enabled: boolean = true) {
  const [letterId] = useAtom(letterIdAtom);

  return useQuery({
    queryKey: ["letterBgm", letterId],
    queryFn: async () => {
      const response = await client.get<ApiResponse<LetterBgmResponse>>(
        "/api/deco/bgm",
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
