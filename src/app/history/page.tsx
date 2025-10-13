"use client";

import Image from "next/image";

// --- 型定義 ---
interface HistoryItem {
  name: string;
  price: number;
}

interface TransactionHistory {
  id: number;
  datetime: string; // "YYYY/MM/DD HH:mm" 形式
  store: string;
  cashier: string;
  items: HistoryItem[];
}

// --- ハードコードされた購入履歴データ ---
// ご提示いただいたDBの商材を使って作成しました
const historyData: TransactionHistory[] = [
  {
    id: 1,
    datetime: "2025/10/12 15:47",
    store: "30",
    cashier: "01",
    items: [
      { name: "DETクリア ブライト&ピール ピーリングジェリー シートマスク", price: 800 },
      { name: "DETクリア ブライト&ピール ピーリングジェリー <フルーティ>", price: 1200 },
    ],
  },
  {
    id: 2,
    datetime: "2025/10/10 18:21",
    store: "30",
    cashier: "02",
    items: [
      { name: "DETクリア ブライト&ピール ピーリングジェリー <ミックスベリーの香り>", price: 1200 },
    ],
  },
  {
    id: 3,
    datetime: "2025/10/09 11:05",
    store: "30",
    cashier: "01",
    items: [
      { name: "DETクリア ブライト&ピール ピーリングジェリー <無香料タイプ>", price: 1200 },
      { name: "DETクリア ブライト&ピール ピーリングジェリー シートマスク", price: 800 },
      { name: "DETクリア ブライト&ピール ピーリングジェリー <フルーティ>", price: 1200 },
    ],
  },
];


export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-brand-ink">
        <Image src="/icons/history.svg" alt="" width={20} height={20} />
        <span>購入履歴</span>
      </h2>

      {historyData.map((transaction) => {
        const totalAmount = transaction.items.reduce((sum, item) => sum + item.price, 0);

        return (
          <div key={transaction.id} className="rounded-3xl bg-brand-card p-5 shadow-[0_12px_28px_rgba(3,2,19,0.08)] ring-1 ring-brand-border/50">
            {/* ヘッダー: 日付と合計金額 */}
            <div className="flex justify-between items-start border-b border-brand-border/60 pb-3 mb-3">
              <div>
                <p className="font-semibold text-brand-ink">{transaction.datetime}</p>
                <p className="text-xs text-brand-muted">
                  店舗:{transaction.store} | レジ担:{transaction.cashier}
                </p>
              </div>
              <p className="text-lg font-bold text-brand-ink">
                ¥{totalAmount.toLocaleString()}
              </p>
            </div>
            {/* 明細 */}
            <ul className="space-y-1.5">
              {transaction.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-sm">
                  <span className="flex-1 truncate pr-4">{item.name}</span>
                  <span className="font-semibold">¥{item.price.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}