const CACHE_NAME = 'okurimono-note-v2'
const BASE_PATH = '/okurimono-note'

// キャッシュするリソース
const STATIC_CACHE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/manifest.json`,
]

// インストール時: 静的リソースをキャッシュ
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static resources')
      return cache.addAll(STATIC_CACHE_URLS)
    }).then(() => {
      return self.skipWaiting()
    })
  )
})

// アクティベーション時: 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// フェッチ時: キャッシュファースト戦略
self.addEventListener('fetch', (event) => {
  // Chrome拡張機能などのリクエストは無視
  if (!event.request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // キャッシュがあればそれを返す
      if (cachedResponse) {
        return cachedResponse
      }

      // キャッシュがなければネットワークから取得
      return fetch(event.request).then((response) => {
        // レスポンスが有効でない場合はそのまま返す
        if (!response || response.status !== 200 || response.type === 'error') {
          return response
        }

        // 同じオリジンのGETリクエストのみキャッシュ
        if (
          event.request.method === 'GET' &&
          event.request.url.startsWith(self.location.origin)
        ) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }

        return response
      }).catch(() => {
        // ネットワークエラー時はキャッシュから返す（オフライン対応）
        return caches.match(`${BASE_PATH}/`)
      })
    })
  )
})
