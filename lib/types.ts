export interface GiftRecord {
  id: string
  date: string
  amount: number
  category: string
  giver: string
  recipient: string
  memo: string
  hasReturned: boolean
  returnDate: string | null
  returnMemo: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface FilterOptions {
  recipient?: string
  category?: string
  giver?: string
  startDate?: string
  endDate?: string
  hasReturned?: boolean | null
}

export interface AggregationData {
  byRecipient: Record<string, number>
  byGiver: Record<string, number>
  byCategory: Record<string, number>
  byYear: Record<string, number>
  byMonth: Record<string, number>
  total: number
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'お年玉', color: '#FF9FB0' },
  { id: '2', name: '誕生日', color: '#A7D8DE' },
  { id: '3', name: '入学・卒業', color: '#C3D825' },
  { id: '4', name: '出産', color: '#FFD4C8' },
  { id: '5', name: 'お祝い', color: '#E6D5F5' },
  { id: '6', name: 'その他', color: '#D3D3D3' },
]
