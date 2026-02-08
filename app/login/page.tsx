"use client";

import { Header } from "@/components/common/Header";
import Image from "next/image";
import { useKakaoLogin } from "@/hooks/auth/useKakaoLogin";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") ?? "/";
  const { handleKakaoLogin } = useKakaoLogin(redirectUrl);
  const tmpKey = searchParams.get("tmpKey");
  const isProcessing = !!tmpKey;
  const router = useRouter();

  return (
    <main className="h-dvh flex flex-col">
      <Header title="로그인" onExit={() => router.back()} />
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center h-[80%] gap-4">
          <p className="text-gray-400 text-center typo-h2-lg">로그인 중...</p>
          <Spinner className="size-12 text-gray-400" />
        </div>
      ) : (
        <>
          <article className="flex flex-col items-center justify-center gap-4 flex-1 typo-h2-lg">
            <Image src="/logo.svg" alt="Logo" width={44} height={44} priority />
            <p>목소리로 전하는 편지, 올림</p>
          </article>
          <div className="pb-15 px-5">
            <button
              type="button"
              onClick={handleKakaoLogin}
              className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#FEE500] rounded-xl text-black font-medium"
            >
              <Image src="/kakao.svg" alt="카카오톡" width={24} height={24} />
              카카오톡으로 로그인
            </button>
          </div>
        </>
      )}
    </main>
  );
}
