import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, LetterViewResponse } from "@/types/letter";

interface UsePostLetterViewParams {
  secretLetterId: string;
  password: string | null;
}
export function usePostLetterView() {
  return useMutation({
    mutationFn: async ({
      secretLetterId,
      password = null,
    }: UsePostLetterViewParams) => {
      console.log(secretLetterId, password);
      const response = await client.post<ApiResponse<LetterViewResponse>>(
        `/api/letter/view`,
        { secretLetterId, password }
      );
      return response.data;
    },
  });
}
