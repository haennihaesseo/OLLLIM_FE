import { Switch } from "@/components/ui/switch";
import Image from "next/image";

export default function CompletePage() {
  return (
    <article className="h-full">
      <section className="relative flex flex-col items-center justify-center h-[70%] gap-3">
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
          <Switch />
          <p>비밀번호 설정하기</p>
        </div>
      </section>
    </article>
  );
}
