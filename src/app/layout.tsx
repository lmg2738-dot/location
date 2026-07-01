import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { MockBanner } from "@/components/layout/mock-banner";

export const metadata: Metadata = {
  title: "LocationAI - AI 창업 입지 분석",
  description:
    "AI가 상권을 분석하여 창업 성공 가능성을 점수화합니다. 유동인구, 경쟁업체, 임대료, 관광객 데이터 기반 분석.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <MockBanner />
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </body>
    </html>
  );
}
