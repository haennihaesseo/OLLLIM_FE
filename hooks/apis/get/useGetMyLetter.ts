import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, LetterViewResponse } from "@/types/letter";
import { accessTokenAtom } from "@/store/auth";

export function useGetMyLetter(letterId: string) {
  const [accessToken] = useAtom(accessTokenAtom);

  return useQuery({
    queryKey: ["my-letter", letterId],
    queryFn: async () => {
      const response = await client.get<ApiResponse<LetterViewResponse>>(
        `/api/letter/user/${letterId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data.data;
    },
    enabled: !!letterId && !!accessToken,
  });
}
