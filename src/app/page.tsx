"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { useZxing } from "react-zxing";

// --- 型定義 ---
interface Product {
  PRD_ID: number;
  CODE: string;
  NAME: string;
  PRICE: number;
}
interface TransactionResult {
  transaction_id: number;
  total_amount: number;
}

// --- APIエンドポイントを環境変数から取得 ---
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

// --- メインコンポーネント ---
const statusChips = ["レジ担当:--", "店舗:30", "POS:90"];

export default function HomePage() {
  // --- ステート変数 ---
  const [product, setProduct] = useState<Product | null>(null);
  const [purchaseList, setPurchaseList] = useState<Product[]>([]);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isManualInput, setIsManualInput] = useState(false);
  const [manualCode, setManualCode] = useState("");
  
  const [modal, setModal] = useState<{type: 'error' | 'confirm' | 'complete' | null, message?: string}>({ type: null });
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
  const [isReceived, setIsReceived] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);

  // --- バーコードスキャナ ---
  const { ref } = useZxing({
    onDecodeResult(result) {
      const code = result.getText();
      setScannedCode(code);
      fetchProduct(code);
      setIsScanning(false);
    },
    onError(error) {
      console.error("Camera Error:", error);
      setModal({ type: 'error', message: `カメラの起動に失敗しました: ${error.message}` });
      setIsScanning(false);
    },
  });

  // --- API通信 ---
  const fetchProduct = useCallback(async (code: string) => {
    setProduct(null);
    setApiError(null);
    if (!code) {
      setModal({ type: 'error', message: '商品情報を入力してください' });
      return;
    }
    try {
      const response = await fetch(`${API_ENDPOINT}/products/${code}`);
      if (!response.ok) {
        setApiError(response.status === 404 ? "商品が見つかりませんでした" : "商品の取得に失敗しました");
        return;
      }
      const data: Product = await response.json();
      setProduct(data);
      setIsManualInput(false);
      setManualCode("");
    } catch (err) {
      setApiError("APIサーバーに接続できませんでした");
    }
  }, []);
  
  const handleConfirmPurchase = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/purchase/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          EMP_CD: "99999", // ◀◀◀ データベースの定義(5桁)に合う値をフロントエンドから送信
          STORE_CD: "30",
          POS_NO: "90",
          items: purchaseList.map(item => ({ 
            PRD_ID: item.PRD_ID, 
            PRD_CODE: item.CODE, 
            PRD_NAME: item.NAME, 
            PRD_PRICE: item.PRICE 
          }))
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '購入処理に失敗しました。サーバーからの詳細情報がありません。'}));
        console.error("Purchase failed:", errorData);
        throw new Error(errorData.detail || '購入処理に失敗しました。');
      }
      const result: TransactionResult = await response.json();
      setTransactionResult(result);
      setModal({ type: 'complete' });
    } catch (err: any) {
      setModal({ type: 'error', message: err.message || '予期せぬエラーが発生しました。' });
    }
  };

  // --- イベントハンドラ ---
  const handleAddItemToList = () => {
    if (!product) { setModal({ type: 'error', message: '追加する商品がありません' }); return; }
    setPurchaseList((prev) => [...prev, product]);
    setProduct(null); setScannedCode(null); setApiError(null);
  };

  const handlePurchaseClick = () => {
    if (purchaseList.length === 0) { setModal({ type: 'error', message: '商品がリストに追加されていません' }); return; }
    setModal({ type: 'confirm' });
  };
  
  const closeAllModalsAndReset = () => {
    setModal({ type: null }); setPurchaseList([]); setTransactionResult(null); setIsReceived(false);
  };

  const totalAmount = purchaseList.reduce((sum, item) => sum + item.PRICE, 0);
  const totalAmountWithTax = Math.floor(totalAmount * 1.1);

  return (
    <>
      {/* ===== モーダル表示エリア ===== */}
      {modal.type === 'error' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg text-center">
            <p className="text-lg font-semibold mb-6">{modal.message}</p>
            <button onClick={() => setModal({ type: null })} className="w-full rounded-xl bg-brand-ink py-3 text-white font-semibold hover:opacity-90">OK</button>
          </div>
        </div>
      )}
      
      {modal.type === 'confirm' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg text-center">
            <p className="text-lg font-semibold mb-2">購入しますか？</p>
            <div className="my-4 p-4 border border-gray-300 rounded-lg">
              <p className="text-xl font-bold">合計金額：{totalAmountWithTax.toLocaleString()}円 (税込)</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal({ type: null })} className="flex-1 rounded-xl bg-gray-200 py-3 text-gray-700 font-semibold hover:bg-gray-300">
                キャンセル
              </button>
              <button onClick={handleConfirmPurchase} className="flex-1 rounded-xl bg-brand-ink py-3 text-white font-semibold hover:opacity-90">
                購入する
              </button>
            </div>
          </div>
        </div>
      )}

      {modal.type === 'complete' && transactionResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg text-center">
            <p className="text-xl font-bold mb-2">お買い上げありがとうございます</p>
            <p className="text-base mb-4">お取引 No.{transactionResult.transaction_id}</p>
            <div className="my-4 p-4 border border-gray-300 rounded-lg">
              <p className="text-xl font-bold">合計金額：{Math.floor(transactionResult.total_amount * 1.1).toLocaleString()}円 (税込)</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">こちらの画面をレジで提示し商品をお受け取り下さい</p>
            <button onClick={closeAllModalsAndReset} className="w-40 mx-auto rounded-xl bg-brand-ink py-3 text-white font-semibold hover:opacity-90">
              OK
            </button>
            <div className="mt-6 flex items-center justify-center">
              <input type="checkbox" id="received" checked={isReceived} onChange={() => setIsReceived(!isReceived)} className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="received" className="ml-2 block text-sm text-gray-900">受け取り済</label>
            </div>
          </div>
        </div>
      )}
      
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-center">商品詳細</h3>
            <div className="text-left space-y-4 my-4">
              <div>
                <span className="font-semibold text-xs text-gray-500 block">商品名</span>
                <p className="text-base">{selectedProduct.NAME}</p>
              </div>
              <div>
                <span className="font-semibold text-xs text-gray-500 block">バーコード番号</span>
                <p className="text-base font-mono">{selectedProduct.CODE}</p>
              </div>
              <div>
                <span className="font-semibold text-xs text-gray-500 block">価格</span>
                <p className="text-base">¥{selectedProduct.PRICE.toLocaleString()}</p>
              </div>
            </div>
            <button onClick={() => setSelectedProduct(null)} className="w-full mt-6 rounded-xl bg-brand-ink py-3 text-white font-semibold hover:opacity-90">
              閉じる
            </button>
          </div>
        </div>
      )}
      
      {isScanning && (
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center">
          <div className="w-11/12 max-w-sm bg-white p-5 rounded-2xl">
            <p className="text-center text-lg font-semibold mb-4">バーコードをスキャン</p>
            <video ref={ref} className="w-full rounded-lg" />
            <button onClick={() => setIsScanning(false)} className="mt-4 w-full rounded-lg bg-gray-200 py-2.5 font-semibold text-gray-700 hover:bg-gray-300">
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* ===== メインコンテンツ ===== */}
      <div className="flex flex-col gap-6">
        <section className="grid grid-cols-3 gap-2.5">
          {statusChips.map((chip) => ( <div key={chip} className="rounded-full bg-brand-chip px-3 py-2 text-center text-[11px] font-semibold text-brand-ink ring-1 ring-brand-border/50">{chip}</div> ))}
        </section>

        <section className="flex flex-col gap-4 rounded-3xl bg-brand-card p-5 shadow-[0_12px_28px_rgba(3,2,19,0.08)] ring-1 ring-brand-border/50">
          <button onClick={() => { setIsScanning(true); setIsManualInput(false); }} className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-ink py-3.5 text-sm font-semibold text-white shadow-[0_6px_0_rgba(3,2,19,0.12)] transition-all duration-150 hover:opacity-90 active:shadow-[0_2px_0_rgba(3,2,19,0.12)] active:translate-y-1">
            <Image src="/icons/camera.svg" alt="" width={20} height={20} className="invert"/>
            <span>スキャン（カメラ）</span>
          </button>
          
          {!isManualInput ? ( <button onClick={() => { setIsManualInput(true); setProduct(null); setScannedCode(null); }} className="text-center text-sm text-brand-muted hover:underline">手動で入力する</button> ) : (
            <div className="flex flex-col gap-2.5">
              <input type="text" value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="バーコード番号を入力" className="rounded-xl border border-brand-border bg-white px-4 py-3 text-center text-sm font-semibold tracking-widest" />
              <button onClick={() => fetchProduct(manualCode.trim())} className="rounded-xl bg-brand-muted/20 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-muted/30">検索</button>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <div className="rounded-xl border border-brand-border bg-white px-4 py-3 text-center text-sm font-semibold tracking-[0.25em] text-brand-ink">{product?.CODE || scannedCode || "-------------" }</div>
            <div className="rounded-xl border border-brand-border bg-brand-chip px-4 py-3 text-center text-sm font-medium text-brand-muted">{product?.NAME || "商品名"}</div>
            <div className="rounded-xl border border-brand-border bg-brand-chip px-4 py-3 text-center text-sm font-medium text-brand-muted">{product ? `¥ ${product.PRICE.toLocaleString()}` : "単価"}</div>
          </div>
          {apiError && <p className="text-center text-sm text-red-500">{apiError}</p>}
          <button onClick={handleAddItemToList} disabled={!product} className="w-full rounded-2xl bg-brand-ink py-3 text-sm font-semibold text-white shadow-[0_6px_0_rgba(3,2,19,0.12)] transition-all duration-150 hover:opacity-90 active:shadow-[0_2px_0_rgba(3,2,19,0.12)] active:translate-y-1 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0">追加</button>
        </section>

        <section className="flex flex-col gap-4 rounded-3xl bg-brand-card p-5 shadow-[0_12px_28px_rgba(3,2,19,0.08)] ring-1 ring-brand-border/50">
          <div className="flex justify-between items-center">
            <h2 className="flex items-center gap-2 text-base font-semibold text-brand-ink"><Image src="/icons/cart.svg" alt="" width={20} height={20} /><span>購入リスト</span></h2>
            <div className="text-sm font-semibold">合計: <span className="text-lg">¥{totalAmount.toLocaleString()}</span></div>
          </div>
          <div className="min-h-[120px] rounded-xl border border-brand-border bg-brand-chip p-2">
            {purchaseList.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm font-medium text-brand-muted">商品が追加されていません</div>
            ) : (
              <ul className="space-y-1">
                {purchaseList.map((item, index) => (
                  <li key={`${item.PRD_ID}-${index}`} className="flex justify-between items-center text-sm p-2 rounded-lg cursor-pointer hover:bg-gray-200/60" onClick={() => setSelectedProduct(item)}>
                    <span className="flex-1 truncate pr-2">{item.NAME}</span>
                    <span className="px-3 text-brand-muted">x 1</span>
                    <span className="w-20 text-right font-semibold">¥{item.PRICE.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={handlePurchaseClick} disabled={purchaseList.length === 0} className="w-full rounded-2xl bg-brand-ink py-3 text-sm font-semibold text-white shadow-[0_6px_0_rgba(3,2,19,0.12)] transition-all duration-150 hover:opacity-90 active:shadow-[0_2px_0_rgba(3,2,19,0.12)] active:translate-y-1 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0">購入</button>
        </section>
      </div>
    </>
  );
}