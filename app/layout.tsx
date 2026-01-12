import type { Metadata } from 'next'
import './globals.css'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'

export const metadata: Metadata = {
  title: 'おくりもの帳',
  description: '子供がいただいたお祝いやお年玉を、家族が簡単に記録・管理できるアプリ',
  manifest: '/okurimono-note/manifest.json',
  themeColor: '#FFB7C5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'おくりもの帳',
  },
  icons: {
    icon: [
      { url: '/okurimono-note/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/okurimono-note/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/okurimono-note/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="font-sans">
        <ServiceWorkerRegistration />
        <div className="min-h-screen">
          <header className="bg-soft-white shadow-soft">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-sakura">
                おくりもの帳
              </h1>
              <p className="text-sm text-warm-gray/70 mt-1">
                心のこもった贈り物を家族で記録
              </p>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
