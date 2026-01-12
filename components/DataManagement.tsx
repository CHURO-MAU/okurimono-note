'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { GiftRecord } from '@/lib/types'
import {
  downloadDataAsJSON,
  importDataOverwrite,
  importDataAppend,
  readFileAsText,
} from '@/lib/dataManagement'

interface DataManagementProps {
  onDataImported: (records: GiftRecord[]) => void
  onClose: () => void
}

export default function DataManagement({ onDataImported, onClose }: DataManagementProps) {
  const [importMode, setImportMode] = useState<'overwrite' | 'append'>('append')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    try {
      downloadDataAsJSON()
      setMessage({ type: 'success', text: '✅ でーたを だうんろーどしました！' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: '❌ だうんろーどに しっぱいしました' })
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルタイプのチェック
    if (!file.name.endsWith('.json')) {
      setMessage({ type: 'error', text: '❌ JSONふぁいるを せんたくしてください' })
      return
    }

    try {
      const jsonString = await readFileAsText(file)

      const result =
        importMode === 'overwrite'
          ? importDataOverwrite(jsonString)
          : importDataAppend(jsonString)

      if (result.success) {
        setMessage({
          type: 'success',
          text: `✅ ${result.count}けんの でーたを ${
            importMode === 'overwrite' ? 'ふっきゅうしました' : 'ついかしました'
          }！`,
        })

        // データをリロード
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setMessage({ type: 'error', text: `❌ ${result.error}` })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ ふぁいるの よみこみに しっぱいしました' })
    }

    // ファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-warm-cream rounded-softer max-w-lg w-full p-6 space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-sakura">💾 でーた ばっくあっぷ</h2>
          <button
            onClick={onClose}
            className="text-2xl text-warm-gray/60 hover:text-warm-gray transition-colors"
          >
            ✕
          </button>
        </div>

        {/* メッセージ */}
        {message && (
          <div
            className={`p-4 rounded-soft text-sm font-medium ${
              message.type === 'success'
                ? 'bg-wakakusa/20 text-wakakusa border border-wakakusa/30'
                : 'bg-red-100 text-red-600 border border-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* エクスポートセクション */}
        <div className="card">
          <h3 className="text-lg font-bold text-warm-gray mb-3">📤 でーたの ばっくあっぷ</h3>
          <p className="text-sm text-warm-gray/70 mb-4">
            いまの でーたを ふぁいるに ほぞんします。<br />
            ぶらうざの でーたが きえても、このふぁいるから ふっきゅうできます。
          </p>
          <button onClick={handleExport} className="btn-primary w-full">
            📥 でーたを だうんろーど
          </button>
        </div>

        {/* インポートセクション */}
        <div className="card">
          <h3 className="text-lg font-bold text-warm-gray mb-3">📥 でーたの ふっきゅう</h3>
          <p className="text-sm text-warm-gray/70 mb-4">
            ほぞんした ふぁいるから でーたを よみこみます。
          </p>

          {/* インポートモード選択 */}
          <div className="space-y-3 mb-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="append"
                checked={importMode === 'append'}
                onChange={() => setImportMode('append')}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-warm-gray">➕ ついか（すいしょう）</div>
                <div className="text-xs text-warm-gray/60">
                  いまの でーたは のこして、ふぁいるの でーたを ついかします
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="overwrite"
                checked={importMode === 'overwrite'}
                onChange={() => setImportMode('overwrite')}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-warm-gray">🔄 ぜんぶ おきかえ</div>
                <div className="text-xs text-warm-gray/60">
                  いまの でーたを けして、ふぁいるの でーたに おきかえます
                </div>
              </div>
            </label>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button onClick={handleImportClick} className="btn-secondary w-full">
            📂 ふぁいるを えらぶ
          </button>
        </div>

        {/* 注意事項 */}
        <div className="bg-peach/10 border border-peach rounded-soft p-4">
          <p className="text-xs text-warm-gray/70">
            ⚠️ <strong>ちゅうい：</strong>
            <br />
            LocalStorage（ぶらうざの でーた）は、ぶらうざの せっていを けしたり、
            しーくれっともーどを つかうと きえてしまいます。
            <br />
            ていきてきに ばっくあっぷを とることを おすすめします。
          </p>
        </div>

        {/* 閉じるボタン */}
        <button onClick={onClose} className="btn-secondary w-full">
          とじる
        </button>
      </div>
    </div>
  )
}
