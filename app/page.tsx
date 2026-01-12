'use client'

import { useState, useEffect } from 'react'
import { GiftRecord } from '@/lib/types'
import { getRecords } from '@/lib/storage'
import GiftList from '@/components/GiftList'
import GiftForm from '@/components/GiftForm'
import Dashboard from '@/components/Dashboard'
import FilterBar from '@/components/FilterBar'
import DataManagement from '@/components/DataManagement'

export default function Home() {
  const [records, setRecords] = useState<GiftRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<GiftRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<GiftRecord | null>(null)
  const [activeTab, setActiveTab] = useState<'list' | 'dashboard' | 'backup'>('list')
  const [showDataManagement, setShowDataManagement] = useState(false)

  useEffect(() => {
    const loadedRecords = getRecords()
    setRecords(loadedRecords)
    setFilteredRecords(loadedRecords)
  }, [])

  const handleRecordsUpdate = (updatedRecords: GiftRecord[]) => {
    setRecords(updatedRecords)
    setFilteredRecords(updatedRecords)
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
    <div className="relative pb-20">
      {/* メインコンテンツ */}
      <div className="space-y-6">
        {activeTab === 'list' && (
          <>
            <FilterBar
              records={records}
              onFilterChange={setFilteredRecords}
            />

            <GiftList
              records={filteredRecords}
              onEdit={handleEdit}
              onUpdate={handleRecordsUpdate}
            />
          </>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard records={records} />
        )}

        {activeTab === 'backup' && (
          <DataManagement
            onDataImported={handleRecordsUpdate}
            onClose={() => setActiveTab('list')}
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
        className="fixed bottom-24 right-6 w-14 h-14 bg-sakura text-white rounded-full shadow-lg hover:bg-sakura/90 transition-all duration-200 flex items-center justify-center text-2xl z-40"
        aria-label="新しく記録"
      >
        +
      </button>

      {/* 下部ナビゲーションバー */}
      <nav className="fixed bottom-0 left-0 right-0 bg-soft-white border-t border-peach/20 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeTab === 'list'
                  ? 'text-sakura'
                  : 'text-warm-gray hover:text-sakura'
              }`}
            >
              <span className="text-2xl mb-1">📝</span>
              <span className="text-xs font-medium">記録一覧</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-sakura'
                  : 'text-warm-gray hover:text-sakura'
              }`}
            >
              <span className="text-2xl mb-1">📊</span>
              <span className="text-xs font-medium">集計</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeTab === 'backup'
                  ? 'text-sakura'
                  : 'text-warm-gray hover:text-sakura'
              }`}
            >
              <span className="text-2xl mb-1">💾</span>
              <span className="text-xs font-medium">バックアップ</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
