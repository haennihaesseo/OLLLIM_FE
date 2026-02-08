import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { letterIdAtom } from "@/store/letterAtoms";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, BgmSelectResponse } from "@/types/letter";

interface PostBgmParams {
  bgmId: string | null;
  bgmSize: number | null;
}

interface UsePostLetterBgmOptions {
  skipInvalidate?: boolean;
}

export function usePostLetterBgm(options?: UsePostLetterBgmOptions) {
  const queryClient = useQueryClient();
  const [letterId] = useAtom(letterIdAtom);

  return useMutation({
    mutationFn: async ({ bgmId, bgmSize }: PostBgmParams) => {
      // 배경음 없음일 때는 query string 없이 요청
      const url = bgmId === null 
        ? `/api/deco/bgm/select`
        : `/api/deco/bgm/select?bgmId=${bgmId}&bgmSize=${Math.ceil(bgmSize!)}`;
      
      const response = await client.post<ApiResponse<BgmSelectResponse>>(
        url,
        null,
        {
          headers: {
            letterId: letterId,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // letter 데이터 쿼리 무효화
      if (!options?.skipInvalidate) {
        queryClient.invalidateQueries({
          queryKey: ["letter", letterId],
        });
      }
    },
  });
}
