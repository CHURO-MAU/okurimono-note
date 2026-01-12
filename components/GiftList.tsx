'use client'

import { useState } from 'react'
import { GiftRecord } from '@/lib/types'
import { deleteRecord, getRecords } from '@/lib/storage'
import { formatCurrency, formatDate } from '@/lib/utils'

interface GiftListProps {
  records: GiftRecord[]
  onEdit: (record: GiftRecord) => void
  onUpdate: (records: GiftRecord[]) => void
}

export default function GiftList({ records, onEdit, onUpdate }: GiftListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    if (confirm('この記録を削除しますか？')) {
      deleteRecord(id)
      const updatedRecords = getRecords()
      onUpdate(updatedRecords)
    }
  }

  if (records.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-warm-gray/60 text-lg">
          まだ記録がありません
        </p>
        <p className="text-warm-gray/40 text-sm mt-2">
          「新しく記録」ボタンから記録を追加しましょう
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {records.map(record => (
        <div
          key={record.id}
          className="card hover:shadow-soft-lg transition-shadow cursor-pointer"
          onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-sakura">
                  {formatCurrency(record.amount)}
                </span>
                <span className="px-3 py-1 bg-peach/30 rounded-full text-sm font-medium">
                  {record.category}
                </span>
                {record.hasReturned && (
                  <span className="px-3 py-1 bg-sora/30 rounded-full text-xs font-medium">
                    ✓ お返し済み
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-warm-gray/60">日付:</span>{' '}
                  <span className="font-medium">{formatDate(record.date)}</span>
                </div>
                <div>
                  <span className="text-warm-gray/60">贈り主:</span>{' '}
                  <span className="font-medium">{record.giver}</span>
                </div>
                <div>
                  <span className="text-warm-gray/60">受け取った子供:</span>{' '}
                  <span className="font-medium">{record.recipient}</span>
                </div>
              </div>

              {expandedId === record.id && (
                <div className="mt-4 pt-4 border-t border-peach/20 space-y-2">
                  {record.memo && (
                    <div>
                      <span className="text-warm-gray/60 text-sm">メモ:</span>
                      <p className="text-sm mt-1 text-warm-gray">{record.memo}</p>
                    </div>
                  )}

                  {record.hasReturned && (
                    <div className="bg-sora/10 rounded-soft p-3">
                      <p className="text-sm font-medium text-sora mb-1">
                        お返し・内祝い情報
                      </p>
                      {record.returnDate && (
                        <p className="text-xs text-warm-gray">
                          日付: {formatDate(record.returnDate)}
                        </p>
                      )}
                      {record.returnMemo && (
                        <p className="text-xs text-warm-gray mt-1">
                          内容: {record.returnMemo}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(record)
                      }}
                      className="btn-secondary text-sm py-1.5 px-4"
                    >
                      ✏️ 編集
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(record.id)
                      }}
                      className="text-sm py-1.5 px-4 rounded-soft border-2 border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      🗑️ 削除
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="ml-4">
              <span className="text-2xl text-warm-gray/30">
                {expandedId === record.id ? '▲' : '▼'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
