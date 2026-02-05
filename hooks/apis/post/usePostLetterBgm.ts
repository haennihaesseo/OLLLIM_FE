import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { letterIdAtom } from "@/store/letterAtoms";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, BgmSelectResponse } from "@/types/letter";

interface PostBgmParams {
  bgmId: string;
  bgmSize: number;
}

interface UsePostLetterBgmOptions {
  skipInvalidate?: boolean;
}

export function usePostLetterBgm(options?: UsePostLetterBgmOptions) {
  const queryClient = useQueryClient();
  const [letterId] = useAtom(letterIdAtom);

  return useMutation({
    mutationFn: async ({ bgmId, bgmSize }: PostBgmParams) => {
      const response = await client.post<ApiResponse<BgmSelectResponse>>(
        `/api/deco/bgm/select?bgmId=${bgmId}&bgmSize=${Math.ceil(bgmSize)}`,
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
