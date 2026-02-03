import { HomeHeader } from "@/components/home/HomeHeader";
import { Mail, Nfc, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="h-dvh flex flex-col">
      <HomeHeader />
      <article className="flex-1 overflow-auto">
        <section className="px-5 py-10 bg-[#FFF0F2] flex flex-col items-start justify-center gap-2">
          <Mail size={25} className="text-primary-700" />
          <h1 className="typo-h2-4xl text-gray-900 pt-3">
            목소리로 <br />
            마음을 전하는 편지,{" "}
            <span className="text-primary-700 whitespace-nowrap">올림</span>
          </h1>
          <p className="typo-body1-md text-gray-900">
            글자로는 담기 어려웠던 감정들에 <br />
            당신의 목소리를 담아 소중한 사람에게 전달해보세요
          </p>
          <div className="relative flex flex-col w-full items-start justify-center gap-2 p-5 bg-primary-700 rounded-lg shadow-lg mt-5">
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
              당신의 마음을 <br />
              목소리로 전해보세요
            </p>
            <Link href="/letter/new/record" className="w-full">
              <Button className="bg-white text-primary-700 h-11 w-full mt-5">
                시작하기
              </Button>
            </Link>
          </div>
        </section>
        <section className="p-5 flex flex-col items-start justify-center w-full gap-5">
          <div className="flex flex-col w-full items-start justify-center gap-2 border-gray-300 border rounded-lg px-5 py-7 shadow-md">
            <Pencil size={28} className="text-primary-700" />
            <div className="flex items-center justify-between gap-2 w-full">
              <h3 className="typo-h2-lg text-gray-900">
                지금까지 올림을 통해 보내진 편지
              </h3>
              <p className="typo-h2-2xl text-primary-700">10개</p>
            </div>
          </div>
          <div className="flex w-full items-start justify-center gap-2 bg-gray-100 border-gray-300 border rounded-lg px-5 py-7 shadow-md">
            <Nfc size={28} />
            <div className="flex flex-col items-start justify-between gap-2 w-full">
              <h3 className="typo-h2-lg text-gray-900 ">
                NFC 굿즈로 실물 전달
              </h3>
              <p className="typo-body1-sm text-gray-500">
                작성한 편지를 카세트 테이프 키링으로 제작해 선물할 수 있어요
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
