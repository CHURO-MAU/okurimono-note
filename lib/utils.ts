import { GiftRecord, FilterOptions, AggregationData } from './types'

// フィルタリング
export const filterRecords = (
  records: GiftRecord[],
  filters: FilterOptions
): GiftRecord[] => {
  return records.filter(record => {
    if (filters.recipient && record.recipient !== filters.recipient) {
      return false
    }
    if (filters.category && record.category !== filters.category) {
      return false
    }
    if (filters.giver && record.giver !== filters.giver) {
      return false
    }
    if (filters.startDate && record.date < filters.startDate) {
      return false
    }
    if (filters.endDate && record.date > filters.endDate) {
      return false
    }
    if (filters.hasReturned !== null && filters.hasReturned !== undefined) {
      if (record.hasReturned !== filters.hasReturned) {
        return false
      }
    }
    return true
  })
}

// 集計
export const aggregateRecords = (records: GiftRecord[]): AggregationData => {
  const byRecipient: Record<string, number> = {}
  const byGiver: Record<string, number> = {}
  const byCategory: Record<string, number> = {}
  const byYear: Record<string, number> = {}
  const byMonth: Record<string, number> = {}
  let total = 0

  records.forEach(record => {
    const amount = record.amount

    // 受取人別
    byRecipient[record.recipient] = (byRecipient[record.recipient] || 0) + amount

    // 贈り主別
    byGiver[record.giver] = (byGiver[record.giver] || 0) + amount

    // カテゴリー別
    byCategory[record.category] = (byCategory[record.category] || 0) + amount

    // 年別
    const year = record.date.slice(0, 4)
    byYear[year] = (byYear[year] || 0) + amount

    // 月別 (YYYY-MM形式)
    const month = record.date.slice(0, 7)
    byMonth[month] = (byMonth[month] || 0) + amount

    total += amount
  })

  return {
    byRecipient,
    byGiver,
    byCategory,
    byYear,
    byMonth,
    total,
  }
}

// ソート
export const sortRecords = (
  records: GiftRecord[],
  sortBy: 'date' | 'amount' | 'recipient' | 'giver',
  order: 'asc' | 'desc' = 'desc'
): GiftRecord[] => {
  const sorted = [...records].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'date':
        comparison = a.date.localeCompare(b.date)
        break
      case 'amount':
        comparison = a.amount - b.amount
        break
      case 'recipient':
        comparison = a.recipient.localeCompare(b.recipient)
        break
      case 'giver':
        comparison = a.giver.localeCompare(b.giver)
        break
    }

    return order === 'asc' ? comparison : -comparison
  })

  return sorted
}

// 金額をフォーマット
export const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString('ja-JP')}`
}

// 日付をフォーマット
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

// ユニークな値を取得
export const getUniqueValues = (records: GiftRecord[], key: keyof GiftRecord): string[] => {
  const values = records.map(r => String(r[key]))
  return Array.from(new Set(values)).sort()
}
