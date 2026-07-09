import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import receiptsRouter from './routes/receipts.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// ヘルスチェック用エンドポイント
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/receipts', receiptsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'サーバー内部でエラーが発生しました。' });
});

app.listen(PORT, () => {
  console.log(`kakeibo-server listening on http://localhost:${PORT}`);
});
