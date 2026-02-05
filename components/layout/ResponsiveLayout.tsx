import { ReactNode } from "react";
import Image from "next/image";

export function ResponsiveLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center bg-gray-300">
      <div className="fixed bottom-15 left-15 hidden lg:flex items-center justify-center gap-4">
        <Image src="/full_logo.svg" alt="logo" width={100} height={100} />
        <div>
          <div className="typo-body1-xl">
            목소리로
            <br /> 마음을 전하는 편지,
          </div>
          <div className="typo-h1-5xl">올림</div>
        </div>
      </div>
      <main className="w-full lg:w-104 lg:max-w-104 bg-white lg:shadow-2xl overflow-hidden">
        {children}
      </main>
    </div>
  );
}
