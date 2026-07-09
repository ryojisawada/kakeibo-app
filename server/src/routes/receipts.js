import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { analyzeReceiptImage } from '../services/claudeService.js';

const router = Router();

// 画像はディスクに保存せずメモリ上でのみ扱う(ブラウザから直接 Claude API キーを使わないため、
// 必ずこのサーバーを経由して Claude API を呼び出す)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

router.post('/analyze', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'レシート画像がアップロードされていません。' });
    }
    if (!ALLOWED_MIME_TYPES.has(req.file.mimetype)) {
      return res.status(400).json({ error: '対応していない画像形式です(JPEG/PNG/WebP/GIFのみ)。' });
    }

    const base64 = req.file.buffer.toString('base64');
    const result = await analyzeReceiptImage({
      base64,
      mediaType: req.file.mimetype,
    });

    // フロントエンドでそのまま一覧表示・localStorage保存できる形に整形する
    const items = result.items.map((item) => ({
      id: randomUUID(),
      name: item.name,
      price: item.price,
      category: item.category,
      date: result.purchasedAt,
      storeName: result.storeName,
    }));

    res.json({ items });
  } catch (error) {
    next(error);
  }
});

export default router;
