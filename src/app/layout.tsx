import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppFooter from "./components/AppFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "イベント専用購入アプリ",
  description: "POS Application for Events",
};

const AppHeader = () => (
  <header className="flex-shrink-0 bg-gradient-to-b from-[#C9CEDA] to-[#C3C7D4] px-6 py-5 text-center shadow-[0_4px_12px_rgba(3,2,19,0.08)]">
    <h1 className="text-sm font-semibold tracking-[0.08em] text-brand-ink">
      『イベント名称』専用購入アプリ
    </h1>
  </header>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-brand-surface antialiased`}
      >
        <div className="flex h-screen justify-center lg:px-4">
          <div className="app-frame flex w-full flex-col lg:max-w-5xl">
            {/* メインのスクロールエリア */}
            <main className="flex flex-1 flex-col overflow-y-auto">
              <AppHeader />
              <div className="flex flex-1 flex-col px-5 py-5">{children}</div>
            </main>
            {/* フッターはスクロールエリアの外に出す */}
            <AppFooter />
          </div>
        </div>
      </body>
    </html>
  );
}