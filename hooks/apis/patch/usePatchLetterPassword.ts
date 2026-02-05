import { client } from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { accessTokenAtom } from "@/store/auth";
import { ApiResponse } from "@/types/letter";
import { toast } from "sonner";

export const usePatchLetterPassword = () => {
  const [accessToken] = useAtom(accessTokenAtom);

  return useMutation({
    mutationFn: async (data: {
      secretLetterKey: string;
      password: string | null;
    }) => {
      const response = await client.patch<ApiResponse<null>>(
        `/api/letter/password`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      if (variables.password === null) {
        toast.success("비밀번호가 해제되었습니다");
      } else {
        toast.success("비밀번호 설정이 완료되었습니다");
      }
    },
  });
};
