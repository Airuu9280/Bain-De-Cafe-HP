/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Notion がホストする画像
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: '*.notion.so' },
      // ImageKit（ケーキ写真のホスティング先）
      { protocol: 'https', hostname: 'ik.imagekit.io' },
      // imgbb を使う場合
      { protocol: 'https', hostname: 'i.ibb.co' },
      // Instagram / 外部画像を使う場合はここに追加
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
