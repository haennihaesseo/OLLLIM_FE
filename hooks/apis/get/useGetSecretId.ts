import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axiosInstance";
import { ApiResponse, SecretIdResponse } from "@/types/letter";
import { useAtom } from "jotai";
import { accessTokenAtom } from "@/store/auth";

export function useGetSecretId(letterId: string) {
  const [accessToken] = useAtom(accessTokenAtom);
  return useQuery({
    queryKey: ["secretId", letterId],
    queryFn: async () => {
      const response = await client.get<ApiResponse<SecretIdResponse>>(
        `/api/letter/${letterId}/share`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.data;
    },
    enabled: !!accessToken && !!letterId,
  });
}

export default useGetSecretId;
