// ============================
// 📌 TIPAGENS
// ============================

export interface KPIData {
  totalDeposits: number
  cpas: number
  ftds: number
  revShare: number
  estimatedCommission: number
  depositChange: number
  registrations: number
  cliques: number
}

export interface DailyDeposit {
  date: string
  amount: number
  ftd?: number
  cpa?: number
  rev?: number
  estimatedCommission?: number // Calculado manualmente
}

export interface ReferredUser {
  id: string
  username: string
  email: string
  joinDate: string
  depositAmount: number
  status: 'CPA' | 'FTD' | 'Active' | 'Inactive'
  lastActivity: string
}

export interface AffiliateData {
  kpis?: KPIData
  dailyDeposits: DailyDeposit[]
  referredUsers: ReferredUser[]
}

// ============================
// 📌 FUNÇÃO DE FILTRAGEM (usa KPIs fixos do mock)
// ============================

export function getFilteredData(
  data: AffiliateData,
  dateRange: 'week' | 'month' | 'custom',
  customStart?: Date,
  customEnd?: Date
): AffiliateData {
  const now = new Date()
  let startDate: Date

  switch (dateRange) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case 'custom':
      startDate = customStart || new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  const endDate = customEnd || now

  const filteredDeposits = data.dailyDeposits.filter(deposit => {
    const depositDate = new Date(deposit.date)
    return depositDate >= startDate && depositDate <= endDate
  })

  const filteredUsers = data.referredUsers.filter(user => {
    const userDate = new Date(user.joinDate)
    return userDate >= startDate && userDate <= endDate
  })

  return {
    kpis: data.kpis!, // ✅ usa os valores mockados como estão
    dailyDeposits: filteredDeposits,
    referredUsers: filteredUsers
  }
}

// ============================
// ✅ MOCK DE DADOS PARA TESTE
// ============================

import { format } from 'date-fns'

const depositsByDay = [
  1230, 910, 880, 1020, 740, 520, 1400,
  970, 820, 1180, 760, 945, 610, 1330,
  1270, 990, 660, 1434 // Soma: 19129
]

export const mockAffiliateData: AffiliateData = {
  kpis: {
    totalDeposits: 19129,
    cpas: 0,
    ftds: 164,
    revShare: 0,
    estimatedCommission: 0,
    depositChange: 0,
    registrations: 287,
    cliques: 1438
  },

  dailyDeposits: depositsByDay.map((amount, index) => {
    const date = format(new Date(2025, 5, index + 1), "yyyy-MM-dd") // junho = mês 5 (0-based)
    const ftd = Math.random() < 0.2 ? 1 : undefined
    const cpa = Math.random() < 0.1 ? 1 : undefined
    const rev = Math.random() < 0.15 ? 0.2 : undefined

    return { date, amount, ftd, cpa, rev }
  }),

  referredUsers: []
}

// ============================
// 🔚 FIM DO MOCK
// ============================