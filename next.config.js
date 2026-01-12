/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pagesでリポジトリ名のサブパスでホストする場合は以下のコメントを外す
  // basePath: '/okurimono-note',
  // assetPrefix: '/okurimono-note',
}

module.exports = nextConfig
