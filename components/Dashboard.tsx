'use client'

import { GiftRecord } from '@/lib/types'
import { aggregateRecords, formatCurrency } from '@/lib/utils'

interface DashboardProps {
  records: GiftRecord[]
}

export default function Dashboard({ records }: DashboardProps) {
  const data = aggregateRecords(records)

  const renderChart = (title: string, data: Record<string, number>, color: string) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
    const maxValue = Math.max(...entries.map(([, value]) => value), 1)

    return (
      <div className="card">
        <h3 className="text-lg font-bold text-sakura mb-4">{title}</h3>
        <div className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-warm-gray/60 text-sm">データが ありません</p>
          ) : (
            entries.map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-warm-gray">{key}</span>
                  <span className="text-sm font-bold" style={{ color }}>
                    {formatCurrency(value)}
                  </span>
                </div>
                <div className="w-full bg-warm-cream/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(value / maxValue) * 100}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  const unreturned = records.filter(r => !r.hasReturned)

  return (
    <div className="space-y-6">
      {/* 概要カード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-sakura/20 to-sakura/5">
          <p className="text-sm text-warm-gray/70 mb-1">そうがく</p>
          <p className="text-3xl font-bold text-sakura">
            {formatCurrency(data.total)}
          </p>
        </div>

        <div className="card bg-gradient-to-br from-sora/20 to-sora/5">
          <p className="text-sm text-warm-gray/70 mb-1">きろくすう</p>
          <p className="text-3xl font-bold text-sora">
            {records.length}
            <span className="text-base ml-1">けん</span>
          </p>
        </div>

        <div className="card bg-gradient-to-br from-wakakusa/20 to-wakakusa/5">
          <p className="text-sm text-warm-gray/70 mb-1">おかえしずみ</p>
          <p className="text-3xl font-bold text-wakakusa">
            {records.length - unreturned.length}
            <span className="text-base ml-1">けん</span>
          </p>
        </div>

        <div className="card bg-gradient-to-br from-peach/30 to-peach/10">
          <p className="text-sm text-warm-gray/70 mb-1">おかえしみずみ</p>
          <p className="text-3xl font-bold text-red-400">
            {unreturned.length}
            <span className="text-base ml-1">けん</span>
          </p>
        </div>
      </div>

      {/* お返し未済リスト */}
      {unreturned.length > 0 && (
        <div className="card bg-peach/10 border-2 border-peach">
          <h3 className="text-lg font-bold text-red-500 mb-3">
            ⚠️ おかえしが ひつような もの
          </h3>
          <div className="space-y-2">
            {unreturned.map(record => (
              <div key={record.id} className="bg-soft-white rounded-soft p-3 text-sm">
                <div className="flex justify-between">
                  <span>
                    <span className="font-medium">{record.giver}</span> → {record.recipient}
                  </span>
                  <span className="font-bold text-sakura">
                    {formatCurrency(record.amount)}
                  </span>
                </div>
                <div className="text-xs text-warm-gray/60 mt-1">
                  {record.category} ({record.date})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* チャート */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderChart('こどもべつ しゅうけい', data.byRecipient, '#FFB7C5')}
        {renderChart('おくりぬしべつ しゅうけい', data.byGiver, '#A7D8DE')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderChart('カテゴリーべつ しゅうけい', data.byCategory, '#C3D825')}
        {renderChart('ねんべつ しゅうけい', data.byYear, '#FFD4C8')}
      </div>
    </div>
  )
}
