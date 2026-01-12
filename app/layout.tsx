import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'おくりものノート',
  description: '子供がいただいたお祝いやお年玉を、家族が簡単に記録・管理できるアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="font-sans">
        <div className="min-h-screen">
          <header className="bg-soft-white shadow-soft">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-sakura">
                🎁 おくりものノート
              </h1>
              <p className="text-sm text-warm-gray/70 mt-1">
                こころのこもった おくりものを かぞくで きろく
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
