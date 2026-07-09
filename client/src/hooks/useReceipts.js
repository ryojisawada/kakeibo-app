import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'kakeibo-receipts';

function loadFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    // 保存データが壊れている場合は空の状態から始める
    return [];
  }
}

/**
 * レシートから読み取った家計簿データを localStorage に永続化しつつ管理するフック。
 * ページをリロードしてもデータが消えないようにする。
 */
export function useReceipts() {
  const [items, setItems] = useState(loadFromStorage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItems = useCallback((newItems) => {
    setItems((prev) => [...newItems, ...prev]);
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItem = useCallback((id, patch) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  return { items, addItems, removeItem, updateItem, clearAll };
}
