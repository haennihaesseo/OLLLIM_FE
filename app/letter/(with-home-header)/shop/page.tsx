import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ShopPage() {
  return (
    <article className="flex flex-col h-full">
      <header className="flex justify-end px-5">
        <p className="typo-body2-xs text-gray-600 py-2">홈 {">"} 굿즈제작</p>
      </header>
      <Image
        src="/nfc-img.svg"
        alt="shop-header"
        width={350}
        height={320}
        className="w-full h-auto"
      />

      <section className="flex flex-col gap-2 px-5 pt-3 overflow-auto">
        <h1 className="typo-h2-xl">NFC 카세트 테이프 키링 + 편지</h1>
        <h2 className="typo-h2-3xl">7,000원</h2>
        <div className="flex justify-between typo-body1-base py-4">
          <p>배송비</p>
          <p>3,000원 (10,000원 이상 구매 시 무료)</p>
        </div>
        <div className="flex flex-col gap-1 typo-body2-xs text-gray-600 bg-gray-50 rounded-lg p-4">
          <p className="typo-body1-sm">구매 전 확인하세요!</p>
          <p>배송은 구매 후 3~5일 소요됩니다.</p>
        </div>
        <div className="flex flex-col gap-1 py-4">
          <h3 className="typo-h2-base">상세 설명</h3>
          <div className="flex flex-col gap-4 items-center bg-gray-50 rounded-lg p-4">
            <h1 className="typo-h2-2xl">NFC 카세트 테이프 키링</h1>
            <p className="typo-body2-sm text-gray-600 text-center">
              편지 뿐만이 아닌, 레트로한 감성의 NFC 카세트
              <br />
              테이프 키링과 함께 마음을 전달해보세요
            </p>
          </div>
        </div>
      </section>
      <nav className="px-5 mb-15 w-full">
        <div className="flex items-start gap-4 w-full">
          <Button
            variant="outline"
            className="h-auto bg-white border-gray-200 px-4 py-3 rounded-lg typo-body1-medium-base text-gray-800"
            disabled
          >
            이전
          </Button>
          <Button
            className="h-auto flex-1 bg-primary-700 px-4 py-3 rounded-lg typo-heading1-bold-base text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled
          >
            서비스 준비 중
          </Button>
        </div>
      </nav>
    </article>
  );
}
