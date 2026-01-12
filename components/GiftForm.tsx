'use client'

import { useState, useEffect } from 'react'
import { GiftRecord } from '@/lib/types'
import { addRecord, updateRecord, getRecords, getCategories } from '@/lib/storage'

interface GiftFormProps {
  editingRecord: GiftRecord | null
  onClose: () => void
  onUpdate: (records: GiftRecord[]) => void
}

export default function GiftForm({ editingRecord, onClose, onUpdate }: GiftFormProps) {
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    category: '',
    giver: '',
    recipient: '',
    memo: '',
    hasReturned: false,
    returnDate: '',
    returnMemo: '',
  })

  const categories = getCategories()

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        date: editingRecord.date,
        amount: String(editingRecord.amount),
        category: editingRecord.category,
        giver: editingRecord.giver,
        recipient: editingRecord.recipient,
        memo: editingRecord.memo,
        hasReturned: editingRecord.hasReturned,
        returnDate: editingRecord.returnDate || '',
        returnMemo: editingRecord.returnMemo,
      })
    } else {
      // 新規作成時は今日の日付をデフォルト
      const today = new Date().toISOString().split('T')[0]
      setFormData(prev => ({ ...prev, date: today }))
    }
  }, [editingRecord])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const recordData = {
      date: formData.date,
      amount: Number(formData.amount),
      category: formData.category,
      giver: formData.giver,
      recipient: formData.recipient,
      memo: formData.memo,
      hasReturned: formData.hasReturned,
      returnDate: formData.returnDate || null,
      returnMemo: formData.returnMemo,
    }

    if (editingRecord) {
      updateRecord(editingRecord.id, recordData)
    } else {
      addRecord(recordData)
    }

    const updatedRecords = getRecords()
    onUpdate(updatedRecords)
    onClose()
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-sakura">
          {editingRecord ? '✏️ きろくを へんしゅう' : '➕ あたらしく きろく'}
        </h2>
        <button
          onClick={onClose}
          className="text-warm-gray hover:text-sakura transition-colors"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">日付 *</label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">金額 *</label>
            <input
              type="number"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              className="input"
              placeholder="5000"
              min="0"
              required
            />
          </div>
        </div>

        <div>
          <label className="label">カテゴリー *</label>
          <select
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="select"
            required
          >
            <option value="">えらんでください</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">おくってくれたひと *</label>
          <input
            type="text"
            value={formData.giver}
            onChange={e => setFormData({ ...formData, giver: e.target.value })}
            className="input"
            placeholder="おじいちゃん"
            required
          />
        </div>

        <div>
          <label className="label">受け取った子供 *</label>
          <input
            type="text"
            value={formData.recipient}
            onChange={e => setFormData({ ...formData, recipient: e.target.value })}
            className="input"
            placeholder="太郎"
            required
          />
        </div>

        <div>
          <label className="label">メモ</label>
          <textarea
            value={formData.memo}
            onChange={e => setFormData({ ...formData, memo: e.target.value })}
            className="textarea"
            rows={3}
            placeholder="いつも げんきでねと いわれた"
          />
        </div>

        {/* お返し管理 */}
        <div className="border-t-2 border-peach/30 pt-4">
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              id="hasReturned"
              checked={formData.hasReturned}
              onChange={e => setFormData({ ...formData, hasReturned: e.target.checked })}
              className="w-5 h-5 rounded accent-sakura"
            />
            <label htmlFor="hasReturned" className="label mb-0">
              お返し・内祝い済み
            </label>
          </div>

          {formData.hasReturned && (
            <div className="space-y-3 ml-8 pl-4 border-l-2 border-peach">
              <div>
                <label className="label">おかえしした 日付</label>
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={e => setFormData({ ...formData, returnDate: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">お返しの内容</label>
                <textarea
                  value={formData.returnMemo}
                  onChange={e => setFormData({ ...formData, returnMemo: e.target.value })}
                  className="textarea"
                  rows={2}
                  placeholder="カタログギフトを おくった"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary flex-1">
            {editingRecord ? 'こうしん' : 'ついか'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-outline flex-1"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}
