import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "@/app/globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";

export const metadata: Metadata = {
  title: "올림",
  description: "voice letter service",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "올림 편지가 도착했어요!",
    description: "목소리로 전하는 편지, 올림에서 열어보세요",
    url: "https://www.olllim.site",
    siteName: "올림",
    images: [
      {
        url: "https://www.olllim.site/og-img.svg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
      <body>
        <QueryProvider>
          <Suspense fallback={null}>
            <AuthProvider>
              <ResponsiveLayout>{children}</ResponsiveLayout>
              <Toaster />
            </AuthProvider>
          </Suspense>
        </QueryProvider>
      </body>
    </html>
  );
}
