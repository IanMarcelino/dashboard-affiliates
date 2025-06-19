import { subDays } from 'date-fns'
import type { AffiliateData, KPIData } from '@/lib/mock-data'
import { DEALS_BY_USER } from '@/lib/deals_btags'

export function getFilteredDashboardData(
  raw: AffiliateData,
  range: 'week' | 'month' | 'custom',
  from?: Date,
  to?: Date,
  userId?: string
): {
  kpi: KPIData
  deposits: typeof raw.dailyDeposits
  referredUsers: typeof raw.referredUsers
} {
  const now = new Date()

  const start =
    range === 'week' ? subDays(now, 7) :
      range === 'month' ? subDays(now, 30) :
        from || subDays(now, 7)

  const end = to || now

  const filteredDeposits = raw.dailyDeposits.filter(dep => {
    const date = new Date(dep.date)
    return date >= start && date <= end
  })

  const previousStart = subDays(start, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const previousEnd = start

  const previousDeposits = raw.dailyDeposits.filter(dep => {
    const date = new Date(dep.date)
    return date >= previousStart && date < previousEnd
  })

  const total = filteredDeposits.reduce((sum, d) => sum + d.amount, 0)
  const previousTotal = previousDeposits.reduce((sum, d) => sum + d.amount, 0)
  const change = previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : 0

  const userConfig = DEALS_BY_USER.find((u) => u.userId === userId)
  const valores = userConfig?.valores

  let estimatedCommission = 0
  let revShare = 0

  if (valores) {
    if (valores.ftd) {
      const totalFtd = filteredDeposits.length
      estimatedCommission += totalFtd * valores.ftd
    }

    if (valores.cpa) {
      const totalCpa = filteredDeposits.reduce((sum, d) => sum + (d.cpa ?? 0), 0)
      estimatedCommission += totalCpa
    }

    if (valores.rev) {
      const revValue = filteredDeposits.reduce((sum, d) => sum + ((d.rev ?? 0) * d.amount), 0)
      estimatedCommission += revValue
      revShare = valores.rev * 100
    }
  }

  const kpi: KPIData = {
    totalDeposits: total,
    ftds: valores?.ftd ? filteredDeposits.length : 0,
    cpas: valores?.cpa ? filteredDeposits.length : 0,
    estimatedCommission,
    revShare,
    depositChange: change
  }

  return {
    kpi,
    deposits: filteredDeposits,
    referredUsers: raw.referredUsers
  }
}