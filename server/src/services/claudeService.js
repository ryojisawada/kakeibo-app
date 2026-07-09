import Anthropic from '@anthropic-ai/sdk';

// 家計簿で扱うカテゴリ一覧(フロントエンドの categories.js と対応させること)
export const CATEGORIES = [
  '食費',
  '日用品',
  '外食',
  '交通',
  '娯楽',
  '医療',
  '衣服',
  'その他',
];

const client = new Anthropic();

// ユーザーが明示的に指定した Claude Haiku の最新バージョン
const MODEL = 'claude-haiku-4-5';

// レシート解析結果を厳密な JSON スキーマに従わせる
const RECEIPT_SCHEMA = {
  type: 'object',
  properties: {
    store_name: {
      type: 'string',
      description: '店舗名。読み取れない場合は空文字列。',
    },
    purchased_at: {
      type: 'string',
      description: 'レシートの購入日。YYYY-MM-DD 形式。読み取れない場合は今日の日付を使う。',
    },
    items: {
      type: 'array',
      description: 'レシートに記載された商品の一覧。',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: '商品名' },
          price: { type: 'integer', description: '金額(円、税込み)' },
          category: {
            type: 'string',
            description: '商品を最も適切なカテゴリに分類する',
            enum: CATEGORIES,
          },
        },
        required: ['name', 'price', 'category'],
        additionalProperties: false,
      },
    },
  },
  required: ['store_name', 'purchased_at', 'items'],
  additionalProperties: false,
};

/**
 * レシート画像(base64)を Claude API に送信し、商品・金額・日付・カテゴリを抽出する。
 * @param {{ base64: string, mediaType: string }} image
 * @returns {Promise<{ storeName: string, purchasedAt: string, items: Array<{ name: string, price: number, category: string }> }>}
 */
export async function analyzeReceiptImage({ base64, mediaType }) {
  const today = new Date().toISOString().slice(0, 10);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system:
      'あなたは家計簿アプリのレシート読み取りアシスタントです。' +
      'レシート画像から店舗名・購入日・商品ごとの名前と金額を正確に読み取り、' +
      '各商品を与えられたカテゴリの中から最も適切なものに分類してください。' +
      `今日の日付は ${today} です。日付が読み取れない場合はこの日付を使ってください。`,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64,
            },
          },
          {
            type: 'text',
            text: 'このレシート画像を読み取り、指定されたスキーマに従って JSON で出力してください。',
          },
        ],
      },
    ],
    output_config: {
      format: {
        type: 'json_schema',
        schema: RECEIPT_SCHEMA,
      },
    },
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock) {
    throw new Error('Claude からテキスト応答が得られませんでした。');
  }

  const parsed = JSON.parse(textBlock.text);
  return {
    storeName: parsed.store_name ?? '',
    purchasedAt: parsed.purchased_at || today,
    items: parsed.items ?? [],
  };
}
