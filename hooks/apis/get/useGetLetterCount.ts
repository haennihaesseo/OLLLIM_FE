import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, LetterCountResponse } from "@/types/letter";
import { accessTokenAtom } from "@/store/auth";
import { isLoggedInAtom } from "@/store/auth";

export function useGetLetterCount() {
  const [accessToken] = useAtom(accessTokenAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  return useQuery({
    queryKey: ["letterCount", isLoggedIn],

    queryFn: async () => {
      const response = await client.get<ApiResponse<LetterCountResponse>>(
        "/api/letter/home",
        {
          headers: {
            Authorization: isLoggedIn ? `Bearer ${accessToken}` : undefined,
          },
        },
      );
      return response.data.data;
    },
  });
}
