import { client } from "@/lib/axiosInstance";
import { ApiResponse } from "@/types/letter";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { accessTokenAtom, refreshTokenStorage } from "@/store/auth";

export const usePostLogout = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  return useMutation({
    mutationFn: async () => {
      const refreshToken = refreshTokenStorage.get();

      const response = await client.post<ApiResponse<null>>(
        "/api/user/logout",
        {},
        {
          headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            ...(refreshToken && { refreshToken: refreshToken }),
          },
        },
      );
      return response.data.data;
    },
  });
};
