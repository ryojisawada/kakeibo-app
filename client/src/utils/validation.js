// 新しく解析したレシートの明細に対する検証ロジック。

/**
 * 金額が負の値になっている項目を抽出する。
 * (割引行などをClaudeが商品としてそのまま読み取ってしまった場合などに検知する)
 */
export function findNegativePriceItems(items) {
  return items.filter((item) => item.price < 0);
}

/**
 * 既存の明細一覧を receiptId ごとにグループ化し、日付と合計金額の両方が
 * 新しいレシートと一致するものを探す(=同じレシートを重複登録しようとしている疑い)。
 * receiptId を持たない古いデータ(移行前に登録された明細)は比較対象から除外する。
 *
 * @returns {{ date: string, total: number } | null}
 */
export function findDuplicateReceipt(existingItems, newItems) {
  if (newItems.length === 0) return null;

  const date = newItems[0].date;
  const total = newItems.reduce((sum, item) => sum + item.price, 0);

  const receiptTotals = new Map();
  for (const item of existingItems) {
    if (!item.receiptId) continue;
    const current = receiptTotals.get(item.receiptId) ?? { date: item.date, total: 0 };
    current.total += item.price;
    receiptTotals.set(item.receiptId, current);
  }

  const isDuplicate = [...receiptTotals.values()].some(
    (receipt) => receipt.date === date && receipt.total === total,
  );

  return isDuplicate ? { date, total } : null;
}

/**
 * 解析結果に対して上記の検証をまとめて実行する。
 */
export function validateNewReceipt(existingItems, newItems) {
  return {
    negativePriceItems: findNegativePriceItems(newItems),
    duplicate: findDuplicateReceipt(existingItems, newItems),
  };
}
