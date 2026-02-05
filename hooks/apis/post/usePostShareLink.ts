import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { letterIdAtom } from "@/store/letterAtoms";
import { accessTokenAtom } from "@/store/auth";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, ShareLinkResponse } from "@/types/letter";

type UsePostShareLinkOptions = {
  onSuccess?: (secretLetterId: string) => void;
  onError?: () => void;
};

export function usePostShareLink(options?: UsePostShareLinkOptions) {
  const [letterId] = useAtom(letterIdAtom);
  const [accessToken] = useAtom(accessTokenAtom);

  return useMutation({
    mutationFn: async () => {
      const response = await client.post<ApiResponse<ShareLinkResponse>>(
        `/api/letter/share`,
        null,
        {
          headers: {
            letterId: letterId,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data.data.secretLetterId);
    },
    onError: (error) => {
      console.error("링크 생성 실패:", error);
      alert("링크 생성에 실패했습니다.");
      options?.onError?.();
    },
  });
}
