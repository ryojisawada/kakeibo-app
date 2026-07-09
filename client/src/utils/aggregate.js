import { getCategoryNames } from './categories.js';

// カテゴリ別の合計金額を集計する(グラフ描画用に固定のカテゴリ順で返す)
export function aggregateByCategory(items) {
  const totals = new Map(getCategoryNames().map((name) => [name, 0]));
  for (const item of items) {
    const current = totals.get(item.category) ?? 0;
    totals.set(item.category, current + item.price);
  }
  return [...totals.entries()]
    .filter(([, total]) => total > 0)
    .map(([category, total]) => ({ category, total }));
}

// 月別(YYYY-MM)の合計金額を集計し、日付の昇順で返す
export function aggregateByMonth(items) {
  const totals = new Map();
  for (const item of items) {
    const month = item.date?.slice(0, 7) || '不明';
    totals.set(month, (totals.get(month) ?? 0) + item.price);
  }
  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }));
}
