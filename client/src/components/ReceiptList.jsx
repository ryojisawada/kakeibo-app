import { getCategoryColor } from '../utils/categories.js';

function formatYen(amount) {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
}

export default function ReceiptList({ items, onRemove }) {
  if (items.length === 0) {
    return (
      <section className="receipt-list">
        <h2>登録済みの明細</h2>
        <p className="empty-message">まだ登録されたデータがありません。レシートをアップロードしてください。</p>
      </section>
    );
  }

  const sortedItems = [...items].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="receipt-list">
      <h2>登録済みの明細({items.length}件)</h2>
      <div className="receipt-list-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>日付</th>
              <th>商品名</th>
              <th>カテゴリ</th>
              <th className="amount-column">金額</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.name}</td>
                <td>
                  <span
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(item.category) }}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="amount-column">{formatYen(item.price)}</td>
                <td>
                  <button type="button" className="remove-button" onClick={() => onRemove(item.id)}>
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
