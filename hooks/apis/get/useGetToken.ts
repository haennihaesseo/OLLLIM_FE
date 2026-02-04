import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/letter";
import type { TokenResponse } from "@/types/login";

export default function useGetToken(tmpToken: string) {
  return useQuery({
    queryKey: ["token"],
    queryFn: async () => {
      const response = await client.get<ApiResponse<TokenResponse>>(
        "/api/token",
        {
          headers: {
            tmpKey: tmpToken,
          },
        }
      );
      return response.data.data;
    },
    enabled: !!tmpToken,
  });
}
