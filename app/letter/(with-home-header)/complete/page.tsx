"use client";

import { Switch } from "@/components/ui/switch";
import { Archive, Link, Nfc } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePostShareLink } from "@/hooks/apis/post/usePostShareLink";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { accessTokenAtom } from "@/store/auth";
import { toast } from "sonner";
import { usePatchLetterPassword } from "@/hooks/apis/patch/usePatchLetterPassword";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function CompletePage() {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [secretLetterKey, setSecretLetterKey] = useState<string | null>(null);
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [accessToken] = useAtom(accessTokenAtom);
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const { mutate: createShareLink, isPending } = usePostShareLink({
    onSuccess: (secretLetterId) => {
      const url = `${window.location.origin}/letter/${secretLetterId}`;
      setSecretLetterKey(secretLetterId);
      setShareUrl(url);
    },
  });

  const { mutate: patchLetterPassword, isPending: isPatchPasswordPending } =
    usePatchLetterPassword();

  const handleSetPassword = () => {
    if (secretLetterKey) {
      patchLetterPassword({
        secretLetterKey: secretLetterKey,
        password: password,
      });
    }
  };

  // accessToken이 준비된 후 한 번만 POST 요청
  useEffect(() => {
    if (accessToken) {
      createShareLink();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleCopyLink = () => {
    if (shareUrl) {
      // 이미 생성된 링크가 있으면 복사만 수행
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          const id = toast.success(
            "링크가 복사되었습니다. 편지를 전달해보세요",
            {
              className: "bg-gray-800 text-white shadow-lg",
            },
          );
          setTimeout(() => toast.dismiss(id), 2000);
        })
        .catch((err) => {
          console.error("클립보드 복사 실패:", err);
        });
    }
  };

  return (
    <article className="h-full">
      <section className="relative flex flex-col items-center justify-center h-[75%] gap-3">
        <Image
          src="/gif/send_motion.gif"
          alt="send_motion"
          width={100}
          height={100}
          unoptimized
        />
        <h1 className="typo-h1-2xl text-gray-900">
          링크 생성이 완료되었습니다
        </h1>
        <div className="flex items-center gap-4">
          <Switch
            checked={isPasswordEnabled}
            onCheckedChange={(checked) => setIsPasswordEnabled(checked)}
          />
          <p>비밀번호 설정하기</p>
        </div>
        {isPasswordEnabled && (
          <div className="flex items-center gap-2 w-[80%]">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPatchPasswordPending}
            />
            <Button
              onClick={handleSetPassword}
              className=" border-primary-700 border text-primary-700 bg-[#E6002314]"
            >
              확인
            </Button>
          </div>
        )}
      </section>
      <section className="flex flex-col items-center justify-center gap-2 p-5 typo-h1-base">
        <Button
          className="w-full h-12 text-white bg-primary-700"
          onClick={handleCopyLink}
          disabled={isPending}
        >
          <Link />
          <p>링크 복사하기</p>
        </Button>
        <div className="flex items-center justify-center gap-2 w-full">
          <Button
            className="h-12 flex-1 bg-[#E6002314] border-primary-700 border text-primary-700"
            onClick={() => router.push("/letter/shop")}
          >
            <Nfc />
            <p>NFC 굿즈 제작</p>
          </Button>
          <Button
            className="h-12 flex-1 bg-[#E6002314] border-primary-700 border text-primary-700"
            onClick={() => router.push("/letter/archive")}
          >
            <Archive />
            <p>편지 보관함</p>
          </Button>
        </div>
      </section>
    </article>
  );
}
