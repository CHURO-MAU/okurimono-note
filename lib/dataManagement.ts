import { GiftRecord } from './types'
import { getRecords, saveRecords } from './storage'

export interface ExportData {
  version: string
  exportDate: string
  records: GiftRecord[]
}

/**
 * データをJSON形式でエクスポート
 */
export const exportData = (): string => {
  const records = getRecords()
  const data: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    records,
  }
  return JSON.stringify(data, null, 2)
}

/**
 * JSONファイルをダウンロード
 */
export const downloadDataAsJSON = () => {
  const jsonString = exportData()
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url

  // ファイル名に日付を含める
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const timeStr = now.toTimeString().slice(0, 5).replace(/:/g, '')
  link.download = `okurimono-note_${dateStr}_${timeStr}.json`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * JSONデータをインポート（上書きモード）
 */
export const importDataOverwrite = (jsonString: string): { success: boolean; error?: string; count?: number } => {
  try {
    const data = JSON.parse(jsonString) as ExportData

    // バリデーション
    if (!data.records || !Array.isArray(data.records)) {
      return { success: false, error: 'ファイルの形式が正しくありません' }
    }

    // 必須フィールドのチェック
    for (const record of data.records) {
      if (!record.id || !record.date || record.amount === undefined || !record.category || !record.giver || !record.recipient) {
        return { success: false, error: 'ファイルのデータが不完全です' }
      }
    }

    // データを上書き
    saveRecords(data.records)

    return { success: true, count: data.records.length }
  } catch (error) {
    return { success: false, error: 'ファイルの読み込みに失敗しました' }
  }
}

/**
 * JSONデータをインポート（追加モード）
 */
export const importDataAppend = (jsonString: string): { success: boolean; error?: string; count?: number } => {
  try {
    const data = JSON.parse(jsonString) as ExportData

    // バリデーション
    if (!data.records || !Array.isArray(data.records)) {
      return { success: false, error: 'ファイルの形式が正しくありません' }
    }

    // 必須フィールドのチェック
    for (const record of data.records) {
      if (!record.id || !record.date || record.amount === undefined || !record.category || !record.giver || !record.recipient) {
        return { success: false, error: 'ファイルのデータが不完全です' }
      }
    }

    // 既存データを取得
    const existingRecords = getRecords()
    const existingIds = new Set(existingRecords.map(r => r.id))

    // 重複を除いて追加
    const newRecords = data.records.filter(r => !existingIds.has(r.id))
    const mergedRecords = [...existingRecords, ...newRecords]

    // データを保存
    saveRecords(mergedRecords)

    return { success: true, count: newRecords.length }
  } catch (error) {
    return { success: false, error: 'ファイルの読み込みに失敗しました' }
  }
}

/**
 * ファイルから読み込み
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('ファイルの読み込みに失敗しました'))
      }
    }
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'))
    reader.readAsText(file)
  })
}
