import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axiosInstance";
import type { ApiResponse, LetterTemplateResponse } from "@/types/letter";

export function useGetLetterTemplate(enabled: boolean = true) {
  return useQuery({
    queryKey: ["letterTemplate"],
    queryFn: async () => {
      const response = await client.get<ApiResponse<LetterTemplateResponse>>(
        "/api/deco/template"
      );
      return response.data.data;
    },
    enabled,
  });
}
