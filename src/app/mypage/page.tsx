"use client";

import React from "react";

// --- SVGアイコンコンポーネント ---

// 親コンポーネント：classNameを受け取れるように既に正しく定義されている
const Icon = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);

// 型を定義して再利用する
type IconProps = { className?: string };

// ↓↓↓ ここから下の全てのアイコンコンポーネントを修正 ↓↓↓
const User = (props: IconProps) => <Icon {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>;
const CreditCard = (props: IconProps) => <Icon {...props}><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></Icon>;
const Gift = (props: IconProps) => <Icon {...props}><polyline points="20 12 20 22 4 22 4 12" /><rect width="20" height="5" x="2" y="7" /><line x1="12" x2="12" y1="22" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></Icon>;
const Bell = (props: IconProps) => <Icon {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Icon>;
const Globe = (props: IconProps) => <Icon {...props}><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Icon>;
const Settings = (props: IconProps) => <Icon {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></Icon>;
const HelpCircle = (props: IconProps) => <Icon {...props}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></Icon>;
const LogOut = (props: IconProps) => <Icon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></Icon>;
const ChevronRight = (props: IconProps) => <Icon {...props}><path d="m9 18 6-6-6-6" /></Icon>;
// ↑↑↑ ここまで修正 ↑↑↑


// --- メインコンポーネント ---
export default function MyPage() {
  type LinkItemProps = { icon: React.ElementType; title: string; subtitle: string; };
  
  const accountLinks: LinkItemProps[] = [ { icon: User, title: "プロフィール編集", subtitle: "基本情報の変更" }, { icon: CreditCard, title: "支払い方法", subtitle: "クレジットカード・電子マネー" }, { icon: Gift, title: "クーポン・特典", subtitle: "利用可能な特典を確認" }, ];
  const settingsLinks: LinkItemProps[] = [ { icon: Bell, title: "通知設定", subtitle: "プッシュ通知・メール設定" }, { icon: Globe, title: "言語設定", subtitle: "日本語" }, { icon: HelpCircle, title: "ヘルプ・サポート", subtitle: "よくある質問・お問い合わせ" }, ];

  const ListItem = ({ icon: IconComponent, title, subtitle }: LinkItemProps) => (
    <a href="#" className="flex items-center p-4 hover:bg-gray-50 rounded-lg">
      <IconComponent className="h-5 w-5 text-brand-muted mr-4" /> {/* アイコンサイズを少し小さく */}
      <div className="flex-1">
        <p className="font-semibold text-brand-ink text-sm">{title}</p> {/* text-sm に変更 */}
        <p className="text-xs text-brand-muted">{subtitle}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </a>
  );

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* ユーザープロフィール */}
      <section className="flex items-center p-4">
        <div className="w-14 h-14 rounded-full bg-gray-300 mr-4 flex-shrink-0" /> {/* サイズを少し小さく */}
        <div className="flex-1">
          <p className="font-bold text-base text-brand-ink">田中 太郎</p> {/* text-base に変更 */}
          <p className="text-xs text-brand-muted">tanaka.taro@example.com</p> {/* text-xs に変更 */}
        </div>
        <Settings className="h-6 w-6 text-brand-muted cursor-pointer hover:text-brand-ink" />
      </section>

      {/* 保有ポイント */}
      <section className="px-4">
        <div className="relative rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-100 p-5 shadow-lg">
          <p className="text-xs font-semibold text-indigo-900/80">保有ポイント</p> {/* text-xs に変更 */}
          <p className="text-2xl font-bold text-indigo-900">2,450 pt</p> {/* text-2xl に変更 */}
          <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white"> {/* サイズを少し小さく */}
            <Gift className="h-5 w-5"/> {/* サイズを少し小さく */}
          </div>
        </div>
      </section>

      {/* アカウントセクション */}
      <section>
        <h3 className="px-4 text-xs font-bold uppercase text-brand-muted mb-1">アカウント</h3>
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5">
          {accountLinks.map((link, i) => (
            <div key={link.title} className={i !== accountLinks.length - 1 ? "border-b" : ""}>
              <ListItem {...link} />
            </div>
          ))}
        </div>
      </section>

      {/* 設定セクション */}
      <section>
        <h3 className="px-4 text-xs font-bold uppercase text-brand-muted mb-1">設定</h3>
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5">
          {settingsLinks.map((link, i) => (
            <div key={link.title} className={i !== settingsLinks.length - 1 ? "border-b" : ""}>
              <ListItem {...link} />
            </div>
          ))}
        </div>
      </section>
      
      {/* ログアウト */}
      <section className="px-4">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5">
           <a href="#" className="flex items-center p-4 hover:bg-gray-50 rounded-lg">
              <LogOut className="h-5 w-5 text-red-500 mr-4" /> {/* アイコンサイズを少し小さく */}
              <div className="flex-1 font-semibold text-red-500 text-sm">ログアウト</div> {/* text-sm に変更 */}
            </a>
        </div>
      </section>
    </div>
  );
}