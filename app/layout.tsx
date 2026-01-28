import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "OLLLIM",
  description: "voice letter service",
};

const pretendard = localFont({
  src: "../public/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>{children}</body>
    </html>
  );
}
