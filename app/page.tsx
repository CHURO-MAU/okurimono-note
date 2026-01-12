'use client'

import { useState, useEffect } from 'react'
import { GiftRecord } from '@/lib/types'
import { getRecords } from '@/lib/storage'
import GiftList from '@/components/GiftList'
import GiftForm from '@/components/GiftForm'
import Dashboard from '@/components/Dashboard'
import DataManagement from '@/components/DataManagement'
import GiversList from '@/components/GiversList'

export default function Home() {
  const [records, setRecords] = useState<GiftRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<GiftRecord | null>(null)
  const [activeTab, setActiveTab] = useState<'list' | 'givers' | 'dashboard' | 'backup'>('list')

  useEffect(() => {
    const loadedRecords = getRecords()
    // 日付の降順（新しい順）でソート
    const sortedRecords = [...loadedRecords].sort((a, b) => {
      return b.date.localeCompare(a.date)
    })
    setRecords(sortedRecords)
  }, [])

  const handleRecordsUpdate = (updatedRecords: GiftRecord[]) => {
    // 日付の降順（新しい順）でソート
    const sortedRecords = [...updatedRecords].sort((a, b) => {
      return b.date.localeCompare(a.date)
    })
    setRecords(sortedRecords)
  }

  const handleEdit = (record: GiftRecord) => {
    setEditingRecord(record)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingRecord(null)
  }

  return (
    <div className="relative pb-28">
      {/* メインコンテンツ */}
      <div className="space-y-6">
        {activeTab === 'list' && (
          <GiftList
            records={records}
            onEdit={handleEdit}
            onUpdate={handleRecordsUpdate}
          />
        )}

        {activeTab === 'givers' && (
          <GiversList
            records={records}
            onEdit={handleEdit}
            onUpdate={handleRecordsUpdate}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard records={records} />
        )}

        {activeTab === 'backup' && (
          <DataManagement
            onDataImported={handleRecordsUpdate}
            onClose={() => setActiveTab('list')}
            isModal={false}
          />
        )}
      </div>

      {/* フォームモーダル */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-warm-cream rounded-softer max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <GiftForm
              editingRecord={editingRecord}
              onClose={handleFormClose}
              onUpdate={handleRecordsUpdate}
            />
          </div>
        </div>
      )}

      {/* フローティングアクションボタン（右下） */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-sakura text-white rounded-full shadow-lg hover:bg-sakura/90 transition-all duration-200 flex items-center justify-center text-2xl z-40"
        aria-label="新しく記録"
      >
        +
      </button>

      {/* 下部ナビゲーションバー */}
      <nav className="fixed bottom-0 left-0 right-0 bg-soft-white border-t border-peach/20 z-30 pb-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center justify-center flex-1 h-full transition-colors ${
                activeTab === 'list'
                  ? 'text-sakura'
                  : 'text-warm-gray hover:text-sakura'
              }`}
              aria-label="記録一覧"
            >
              <span className="text-3xl">📝</span>
            </button>

            <button
              onClick={() => setActiveTab('givers')}
              className={`flex items-center justify-center flex-1 h-full transition-colors ${
                activeTab === 'givers'
                  ? 'text-sakura'
                  : 'text-warm-gray hover:text-sakura'
              }`}
              aria-label="贈り主別"
            >
              <span className="text-3xl">👥</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center justify-center flex-1 h-full transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-sakura'
                  : 'text-warm-gray hover:text-sakura'
              }`}
              aria-label="集計"
            >
              <span className="text-3xl">📊</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center justify-center flex-1 h-full transition-colors ${
                activeTab === 'backup'
                  ? 'text-sakura'
                  : 'text-warm-gray hover:text-sakura'
              }`}
              aria-label="バックアップ"
            >
              <span className="text-3xl">💾</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
