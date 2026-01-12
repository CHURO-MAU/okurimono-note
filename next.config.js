/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/okurimono-note',
  assetPrefix: '/okurimono-note',
}

module.exports = nextConfig
