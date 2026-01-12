import { GiftRecord, Category, DEFAULT_CATEGORIES } from './types'

const STORAGE_KEYS = {
  RECORDS: 'okurimono-records',
  CATEGORIES: 'okurimono-categories',
}

// Records
export const getRecords = (): GiftRecord[] => {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load records:', error)
    return []
  }
}

export const saveRecords = (records: GiftRecord[]): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records))
  } catch (error) {
    console.error('Failed to save records:', error)
  }
}

export const addRecord = (record: Omit<GiftRecord, 'id' | 'createdAt' | 'updatedAt'>): GiftRecord => {
  const records = getRecords()
  const now = new Date().toISOString()
  const newRecord: GiftRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  records.push(newRecord)
  saveRecords(records)
  return newRecord
}

export const updateRecord = (id: string, updates: Partial<GiftRecord>): GiftRecord | null => {
  const records = getRecords()
  const index = records.findIndex(r => r.id === id)
  if (index === -1) return null

  const updatedRecord = {
    ...records[index],
    ...updates,
    id: records[index].id, // IDは変更不可
    createdAt: records[index].createdAt, // 作成日時も変更不可
    updatedAt: new Date().toISOString(),
  }
  records[index] = updatedRecord
  saveRecords(records)
  return updatedRecord
}

export const deleteRecord = (id: string): boolean => {
  const records = getRecords()
  const filteredRecords = records.filter(r => r.id !== id)
  if (filteredRecords.length === records.length) return false
  saveRecords(filteredRecords)
  return true
}

// Categories
export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES
  } catch (error) {
    console.error('Failed to load categories:', error)
    return DEFAULT_CATEGORIES
  }
}

export const saveCategories = (categories: Category[]): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  } catch (error) {
    console.error('Failed to save categories:', error)
  }
}

export const addCategory = (name: string, color: string): Category => {
  const categories = getCategories()
  const newCategory: Category = {
    id: crypto.randomUUID(),
    name,
    color,
  }
  categories.push(newCategory)
  saveCategories(categories)
  return newCategory
}

export const deleteCategory = (id: string): boolean => {
  const categories = getCategories()
  const filteredCategories = categories.filter(c => c.id !== id)
  if (filteredCategories.length === categories.length) return false
  saveCategories(filteredCategories)
  return true
}
