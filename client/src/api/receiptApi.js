/**
 * レシート画像をバックエンドへ送信し、Claude API による解析結果を取得する。
 * APIキーはブラウザから直接扱わず、必ずサーバー経由で呼び出す。
 */
export async function analyzeReceipt(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch('/api/receipts/analyze', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'レシートの解析に失敗しました。');
  }

  const data = await response.json();
  return data.items;
}
