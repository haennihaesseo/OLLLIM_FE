import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/axiosInstance";

export function usePostLetterVoice() {
  return useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append("voice", audioBlob, "recording.webm");

      return client.post("/api/letter/voice", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
}
