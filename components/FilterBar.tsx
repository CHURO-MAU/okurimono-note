'use client'

import { useState, useEffect } from 'react'
import { GiftRecord, FilterOptions } from '@/lib/types'
import { filterRecords, sortRecords, getUniqueValues } from '@/lib/utils'
import { getCategories } from '@/lib/storage'

interface FilterBarProps {
  records: GiftRecord[]
  onFilterChange: (filtered: GiftRecord[]) => void
}

export default function FilterBar({ records, onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({})
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'recipient' | 'giver'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)

  const categories = getCategories()
  const recipients = getUniqueValues(records, 'recipient')
  const givers = getUniqueValues(records, 'giver')

  useEffect(() => {
    let filtered = filterRecords(records, filters)
    filtered = sortRecords(filtered, sortBy, sortOrder)
    onFilterChange(filtered)
  }, [records, filters, sortBy, sortOrder])

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== null && v !== '').length

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sakura font-medium"
        >
          🔍 フィルター
          {activeFilterCount > 0 && (
            <span className="bg-sakura text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="select text-sm py-1.5"
          >
            <option value="date">日付</option>
            <option value="amount">金額</option>
            <option value="recipient">子供</option>
            <option value="giver">贈り主</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn-outline py-1.5 px-3 text-sm"
          >
            {sortOrder === 'asc' ? '↑ 昇順' : '↓ 降順'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="space-y-3 pt-3 border-t border-peach/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="label text-xs">子供</label>
              <select
                value={filters.recipient || ''}
                onChange={e => handleFilterChange('recipient', e.target.value)}
                className="select text-sm py-1.5"
              >
                <option value="">全て</option>
                {recipients.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-xs">カテゴリー</label>
              <select
                value={filters.category || ''}
                onChange={e => handleFilterChange('category', e.target.value)}
                className="select text-sm py-1.5"
              >
                <option value="">全て</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-xs">贈り主</label>
              <select
                value={filters.giver || ''}
                onChange={e => handleFilterChange('giver', e.target.value)}
                className="select text-sm py-1.5"
              >
                <option value="">全て</option>
                {givers.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-xs">開始日</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={e => handleFilterChange('startDate', e.target.value)}
                className="input text-sm py-1.5"
              />
            </div>

            <div>
              <label className="label text-xs">終了日</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={e => handleFilterChange('endDate', e.target.value)}
                className="input text-sm py-1.5"
              />
            </div>

            <div>
              <label className="label text-xs">お返し</label>
              <select
                value={filters.hasReturned === null || filters.hasReturned === undefined ? '' : String(filters.hasReturned)}
                onChange={e => {
                  const value = e.target.value
                  handleFilterChange('hasReturned', value === '' ? null : value === 'true')
                }}
                className="select text-sm py-1.5"
              >
                <option value="">全て</option>
                <option value="true">済み</option>
                <option value="false">未済</option>
              </select>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-sakura hover:underline"
              >
                ✕ フィルタークリア
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
