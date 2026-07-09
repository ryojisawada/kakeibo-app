// カテゴリ一覧(バックエンドの CATEGORIES と対応させること)。
// 色は常にこの並び順で固定して割り当てる(カテゴリが増減しても色の意味がぶれないようにするため)。
export const CATEGORIES = [
  { name: '食費', color: '#2a78d6' },
  { name: '日用品', color: '#1baf7a' },
  { name: '外食', color: '#eda100' },
  { name: '交通', color: '#008300' },
  { name: '娯楽', color: '#4a3aa7' },
  { name: '医療', color: '#e34948' },
  { name: '衣服', color: '#e87ba4' },
  { name: 'その他', color: '#eb6834' },
];

const COLOR_BY_CATEGORY = new Map(CATEGORIES.map((c) => [c.name, c.color]));
const FALLBACK_COLOR = '#898781';

export function getCategoryColor(categoryName) {
  return COLOR_BY_CATEGORY.get(categoryName) ?? FALLBACK_COLOR;
}

export function getCategoryNames() {
  return CATEGORIES.map((c) => c.name);
}
