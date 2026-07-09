import { useMemo } from 'react';
import ReceiptUploader from './components/ReceiptUploader.jsx';
import ReceiptList from './components/ReceiptList.jsx';
import CategoryPieChart from './components/CategoryPieChart.jsx';
import MonthlyBarChart from './components/MonthlyBarChart.jsx';
import { useReceipts } from './hooks/useReceipts.js';
import { analyzeReceipt } from './api/receiptApi.js';

function formatYen(amount) {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
}

export default function App() {
  const { items, addItems, removeItem } = useReceipts();

  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);

  async function handleAnalyzed(file) {
    const newItems = await analyzeReceipt(file);
    addItems(newItems);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>レシート家計簿</h1>
        <p className="total-amount">合計支出: {formatYen(totalAmount)}</p>
      </header>

      <ReceiptUploader onAnalyzed={handleAnalyzed} />

      <section className="charts">
        <CategoryPieChart items={items} />
        <MonthlyBarChart items={items} />
      </section>

      <ReceiptList items={items} onRemove={removeItem} />
    </div>
  );
}
