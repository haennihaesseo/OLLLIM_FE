import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { letterIdAtom } from "@/store/letterAtoms";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, TemplateSelectResponse } from "@/types/letter";

interface PostTemplateParams {
  templateId: string;
}

interface UsePostLetterTemplateOptions {
  skipInvalidate?: boolean;
}

export function usePostLetterTemplate(options?: UsePostLetterTemplateOptions) {
  const queryClient = useQueryClient();
  const [letterId] = useAtom(letterIdAtom);

  return useMutation({
    mutationFn: async ({ templateId }: PostTemplateParams) => {
      const response = await client.post<ApiResponse<TemplateSelectResponse>>(
        `/api/deco/template?templateId=${templateId}`,
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
