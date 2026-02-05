import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "@/app/globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";

export const metadata: Metadata = {
  title: "OLLLIM",
  description: "voice letter service",
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
