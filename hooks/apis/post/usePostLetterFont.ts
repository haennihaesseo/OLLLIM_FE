import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { letterIdAtom } from "@/store/letterAtoms";
import { client } from "@/lib/axiosInstance";
import { getNextStep } from "@/lib/letterSteps";
import type { ApiResponse } from "@/types/letter";

export function usePostLetterFont() {
  const router = useRouter();
  const [letterId] = useAtom(letterIdAtom);

  return useMutation({
    mutationFn: async (fontId: number) => {
      const response = await client.post<ApiResponse<null>>(
        "/api/letter/font",
        { fontId },
        {
          headers: {
            letterId: letterId,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      const nextStep = getNextStep("/letter/new/analyze");
      if (nextStep) {
        router.push(nextStep);
      }
    },
  });
}
