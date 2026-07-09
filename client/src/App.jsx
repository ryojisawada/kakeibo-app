import { useMemo } from 'react';
import ReceiptUploader from './components/ReceiptUploader.jsx';
import ReceiptList from './components/ReceiptList.jsx';
import CategoryPieChart from './components/CategoryPieChart.jsx';
import MonthlyBarChart from './components/MonthlyBarChart.jsx';
import { useReceipts } from './hooks/useReceipts.js';
import { analyzeReceipt } from './api/receiptApi.js';
import { validateNewReceipt } from './utils/validation.js';

function formatYen(amount) {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
}

export default function App() {
  const { items, addItems, removeItem } = useReceipts();

  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);

  // レシート1枚分の商品には共通の receiptId を付与し、後から「同じレシート」として
  // 重複チェックできるようにする。解析結果はこの時点では保存せず、検証結果とあわせて
  // ReceiptUploader 側の確認画面に渡す。
  async function handleAnalyze(file) {
    const analyzedItems = await analyzeReceipt(file);
    const receiptId = crypto.randomUUID();
    const newItems = analyzedItems.map((item) => ({ ...item, receiptId }));
    const warnings = validateNewReceipt(items, newItems);
    return { items: newItems, warnings };
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>レシート家計簿</h1>
        <p className="total-amount">合計支出: {formatYen(totalAmount)}</p>
      </header>

      <ReceiptUploader onAnalyze={handleAnalyze} onConfirm={addItems} />

      <section className="charts">
        <CategoryPieChart items={items} />
        <MonthlyBarChart items={items} />
      </section>

      <ReceiptList items={items} onRemove={removeItem} />
    </div>
  );
}
