import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

/**
 * Notion のメニューデータベースからケーキ情報を取得
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Notion データベースに必要なカラム一覧
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * カラム名        Notionタイプ      内容
 * ─────────────────────────────────────────────────
 * 名前            タイトル          ケーキの日本語名（必須）
 * fr_name         テキスト          フランス語名（例: Opéra）
 * description     テキスト          説明文
 * price           数値              価格（数字のみ、例: 680）
 * category        マルチセレクト    Pâtisserie / Viennoiserie / Café / Gift（複数選択可）
 * image_url       URL               メイン写真のURL ※取得方法は運用ガイド参照
 * shop_url        URL               楽天市場など販売ページのURL
 * video_url       URL               紹介動画のURL（YouTube の共有URL）
 * published       チェックボックス  ✓ でサイトに表示
 * featured        チェックボックス  ✓ でトップカルーセルに表示（最大5件）
 * order           数値              表示順（1, 2, 3…小さいほど先頭）
 * ─────────────────────────────────────────────────
 *
 * ※ category は「セレクト」ではなく「マルチセレクト」型にしてください。
 *   1つのケーキを複数カテゴリ（例: Pâtisserie と Gift の両方）に表示できます。
 *
 * ※ order が同じ数字の場合は、Notion側で「最後に編集した方」が自動的に
 *   上位（先頭側）に表示されます。元の数字を書き換える必要はありません。
 */
export async function getCakes() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: 'published',
        checkbox: { equals: true },
      },
      sorts: [
        { property: 'order', direction: 'ascending' },
        // order が重複した場合のタイブレーク：
        // 後から編集（入力）した方を先頭側（上位）にする
        { timestamp: 'last_edited_time', direction: 'descending' },
      ],
    });

    return response.results.map((page) => {
      const p = page.properties;
      return {
        id:          page.id,
        name:        p['名前']?.title?.[0]?.plain_text          ?? '',
        fr_name:     p['fr_name']?.rich_text?.[0]?.plain_text    ?? '',
        description: p['description']?.rich_text?.[0]?.plain_text ?? '',
        price:       p['price']?.number                          ?? 0,
        category:    p['category']?.multi_select?.map(c => c.name) ?? [], // ← 複数カテゴリ対応
        image_url:   p['image_url']?.url                         ?? null,
        shop_url:    p['shop_url']?.url                          ?? null,   // ← 楽天などの販売リンク
        video_url:   p['video_url']?.url                         ?? null,   // ← YouTube動画リンク
        featured:    p['featured']?.checkbox                     ?? false,  // ← ヒーローに表示
        order:       p['order']?.number                          ?? 0,
      };
    });
  } catch (err) {
    console.error('Notion API エラー:', err.message);
    return [];
  }
}

/**
 * YouTube URL を埋め込み用 URL に変換するユーティリティ
 *
 * 対応フォーマット:
 *   https://www.youtube.com/watch?v=XXXXXX
 *   https://youtu.be/XXXXXX
 *   https://www.youtube.com/shorts/XXXXXX
 *
 * 戻り値: https://www.youtube.com/embed/XXXXXX  または null
 */
export function toYouTubeEmbed(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ];
  for (const pat of patterns) {
    const m = url.match(pat);
    if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`;
  }
  return null;
}
