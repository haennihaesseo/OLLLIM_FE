import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OLLLIM",
  description: "voice letter service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
