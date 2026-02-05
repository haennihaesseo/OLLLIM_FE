import { client } from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { accessTokenAtom } from "@/store/auth";
import { ApiResponse } from "@/types/letter";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const usePostLetterArchive = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  const router = useRouter();

  return useMutation({
    mutationFn: async (letterId: string) => {
      const response = await client.post<ApiResponse<null>>(
        `/api/letter/${letterId}/save`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      router.push("/letter/archive");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error(error.response?.data?.message || "편지 보관에 실패했습니다.");
    },
  });
};
