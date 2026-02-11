import { HomeHeader } from "@/components/home/HomeHeader";
import { LetterCountCard } from "@/components/home/LetterCountCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="h-dvh flex flex-col">
      <HomeHeader />
      <article className="flex-1 overflow-auto">
        <section className="px-5 pt-5 pb-5 bg-[#FFF0F2] flex flex-col items-start justify-center gap-2">
          <h1 className="typo-h2-3xl text-gray-900">
            목소리로 마음을 전하는 편지,{" "}
            <span className="text-primary-700 whitespace-nowrap">올림</span>
          </h1>
          <p className="typo-body1-md text-gray-900">
            글자로는 담기 어려웠던 감정들에 <br />
            당신의 목소리를 담아 소중한 사람에게 전달해보세요
          </p>
          <div className="relative flex flex-col w-full items-start justify-center gap-2 p-5 bg-primary-700 rounded-lg shadow-lg mt-2">
            <Image
              src="/gif/message.gif"
              alt="message"
              width={100}
              height={100}
              className="absolute top-0 right-2"
              unoptimized
            />
            <h3 className="typo-h1-3xl text-white">새 편지 쓰기</h3>
            <p className="typo-body1-sm text-white">
              말의 속도와 톤을 바탕으로, <br />
              당신의 목소리에 어울리는 폰트가 추천됩니다.
            </p>
            <Link href="/letter/onboarding" className="w-full">
              <Button className="bg-white text-primary-700 h-11 w-full mt-2">
                시작하기
              </Button>
            </Link>
          </div>
        </section>
        <section className="p-4 flex flex-col items-start justify-center w-full gap-5">
          <LetterCountCard />
          <Link
            href="/letter/shop"
            className="flex w-full items-start justify-center gap-2 bg-gray-100 border-gray-300 border rounded-lg p-5 shadow-md"
          >
            <Image
              src="/gif/mail-motion.gif"
              alt="mail-img"
              width={32}
              height={24}
            />
            <div className="flex flex-col items-start justify-between gap-2 w-full mt-0.5">
              <h3 className="typo-h2-lg text-gray-900 ">
                편지를 실물 굿즈에 담아 선물해보세요
              </h3>
              <p className="typo-body1-sm text-gray-500">
                작성한 편지를 NFC 태그가 가능한 카세트테이프
                <br />
                키링으로 제작하여 선물할 수 있어요
              </p>
            </div>
          </Link>
        </section>
      </article>
    </main>
  );
}
