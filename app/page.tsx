'use client'

import { useState, useEffect } from 'react'
import { GiftRecord } from '@/lib/types'
import { getRecords } from '@/lib/storage'
import GiftList from '@/components/GiftList'
import GiftForm from '@/components/GiftForm'
import Dashboard from '@/components/Dashboard'
import FilterBar from '@/components/FilterBar'

export default function Home() {
  const [records, setRecords] = useState<GiftRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<GiftRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<GiftRecord | null>(null)
  const [activeTab, setActiveTab] = useState<'list' | 'dashboard'>('list')

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
    <div className="space-y-6">
      {/* タブナビゲーション */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-3 px-6 rounded-soft font-medium transition-all duration-200 ${
            activeTab === 'list'
              ? 'bg-sakura text-white shadow-soft'
              : 'bg-soft-white text-warm-gray hover:bg-peach/20'
          }`}
        >
          📝 きろくいちらん
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 px-6 rounded-soft font-medium transition-all duration-200 ${
            activeTab === 'dashboard'
              ? 'bg-sakura text-white shadow-soft'
              : 'bg-soft-white text-warm-gray hover:bg-peach/20'
          }`}
        >
          📊 しゅうけい
        </button>
      </div>

      {activeTab === 'list' ? (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              ➕ あたらしく きろく
            </button>
          </div>

          <FilterBar
            records={records}
            onFilterChange={setFilteredRecords}
          />

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

          <GiftList
            records={filteredRecords}
            onEdit={handleEdit}
            onUpdate={handleRecordsUpdate}
          />
        </>
      ) : (
        <Dashboard records={records} />
      )}
    </div>
  )
}
