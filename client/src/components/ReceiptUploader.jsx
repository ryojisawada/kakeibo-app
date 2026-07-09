import { useRef, useState } from 'react';

export default function ReceiptUploader({ onAnalyzed }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleAnalyzeClick() {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    try {
      await onAnalyzed(selectedFile);
      // 解析成功後は入力をリセットして次のレシートに備える
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'レシートの解析に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }

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
    </section>
  );
}
