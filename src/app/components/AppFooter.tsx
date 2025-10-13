"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// フッターのナビゲーション項目
const navItems = [
  { href: "/", icon: "/icons/home.svg", label: "ホーム画面" },
  { href: "/history", icon: "/icons/history.svg", label: "過去購入履歴" },
  { href: "/mypage", icon: "/icons/user.svg", label: "マイページ" },
];

export default function AppFooter() {
  const pathname = usePathname();

  return (
    <footer className="flex-shrink-0 bg-gradient-to-b from-[#C5CAD8] to-[#C3C7D4] px-6 py-3.5 shadow-[0_-4px_12px_rgba(3,2,19,0.06)]">
      <nav className="flex items-center justify-around text-[10px] font-semibold">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-opacity hover:opacity-70 ${
                isActive ? "text-brand-ink" : "text-brand-ink/75"
              }`}
            >
              <Image src={item.icon} alt="" width={22} height={22} className={isActive ? "" : "opacity-75"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}