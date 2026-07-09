import { useRef, useState } from 'react';

function formatYen(amount) {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
}

export default function ReceiptUploader({ onAnalyze, onConfirm }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // 解析済みだがまだ明細に追加していない結果(警告確認用)
  const [pendingResult, setPendingResult] = useState(null);

  function resetAll() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPendingResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);
    setPendingResult(null);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleAnalyzeClick() {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setPendingResult(null);
    try {
      const result = await onAnalyze(selectedFile);
      setPendingResult(result);
    } catch (err) {
      setError(err.message || 'レシートの解析に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }

  function handleConfirmClick() {
    if (!pendingResult) return;
    onConfirm(pendingResult.items);
    resetAll();
  }

  const negativePriceItems = pendingResult?.warnings.negativePriceItems ?? [];
  const duplicate = pendingResult?.warnings.duplicate ?? null;

  return (
    <section className="uploader">
      <h2>レシートをアップロード</h2>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isLoading}
      />

      {previewUrl && (
        <div className="uploader-preview">
          <img src={previewUrl} alt="レシートのプレビュー" />
        </div>
      )}

      <button type="button" onClick={handleAnalyzeClick} disabled={!selectedFile || isLoading}>
        {isLoading ? '解析中...' : 'このレシートを解析する'}
      </button>

      {error && <p className="uploader-error">{error}</p>}

      {pendingResult && (
        <div className="uploader-result">
          <h3>解析結果({pendingResult.items.length}件)</h3>

          {negativePriceItems.length > 0 && (
            <p className="warning-message">
              <span aria-hidden="true">⚠</span>
              金額がマイナスの項目があります:{' '}
              {negativePriceItems.map((item) => `${item.name}(${formatYen(item.price)})`).join('、')}
            </p>
          )}

          {duplicate && (
            <p className="warning-message">
              <span aria-hidden="true">⚠</span>
              同じ日付({duplicate.date})・同じ合計金額({formatYen(duplicate.total)})のレシートが
              既に登録されています。重複登録の可能性があります。
            </p>
          )}

          <ul className="uploader-result-list">
            {pendingResult.items.map((item) => (
              <li key={item.id}>
                {item.name} — {formatYen(item.price)}({item.category})
              </li>
            ))}
          </ul>

          <div className="uploader-result-actions">
            <button type="button" onClick={handleConfirmClick}>
              明細に追加する
            </button>
            <button type="button" className="secondary-button" onClick={resetAll}>
              破棄する
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
