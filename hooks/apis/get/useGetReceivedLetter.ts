import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axiosInstance";
import { ApiResponse, SentLetterResponse } from "@/types/letter";
import { useAtom } from "jotai";
import { accessTokenAtom } from "@/store/auth";

export function useGetReceivedLetter(status: "LATEST" | "EARLIST" = "LATEST") {
  const [accessToken] = useAtom(accessTokenAtom);

  return useQuery({
    queryKey: ["receivedLetter", status],
    queryFn: async () => {
      const response = await client.get<ApiResponse<SentLetterResponse>>(
        `/api/letter/received?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data.data;
    },
    enabled: !!accessToken,
  });
}
