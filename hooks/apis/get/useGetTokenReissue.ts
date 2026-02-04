import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/letter";

type TokenReissueResponse = {
  accessToken: string;
};

export default function useGetTokenReissue(refreshToken: string | null) {
  return useQuery({
    queryKey: ["tokenReissue", refreshToken],
    queryFn: async () => {
      if (!refreshToken) throw new Error("No refresh token");
      
      const response = await client.get<ApiResponse<TokenReissueResponse>>(
        "/api/token/reissue",
        {
          headers: {
            refreshToken: refreshToken,
          },
        }
      );
      return response.data.data;
    },
    enabled: !!refreshToken,
    retry: false,
  });
}
