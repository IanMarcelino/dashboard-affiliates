import { subDays } from 'date-fns'
import type { AffiliateData, KPIData } from '@/lib/mock-data'

export function getFilteredDashboardData(
  raw: AffiliateData,
  range: 'week' | 'month' | 'custom',
  from?: Date,
  to?: Date
): {
  kpi: KPIData
  deposits: typeof raw.dailyDeposits
  referredUsers: typeof raw.referredUsers
} {
  const now = new Date()

  // ✅ Proteção contra dados inválidos
  if (
    !raw ||
    !Array.isArray(raw.dailyDeposits) ||
    !Array.isArray(raw.referredUsers)
  ) {
    return {
      kpi: {
        totalDeposits: 0,
        ftds: 0,
        cpas: 0,
        estimatedCommission: 0,
        revShare: 0,
        depositChange: 0,
        cliques: 0,
        registrations: 0
      },
      deposits: [],
      referredUsers: []
    }
  }

  const start =
    range === 'week' ? subDays(now, 7)
      : range === 'month' ? subDays(now, 30)
        : from || subDays(now, 7)

  const end = to || now

  // 🔎 Filtrando depósitos atuais e anteriores
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

  // ✅ Somando valores com segurança contra null/undefined
  const total = filteredDeposits.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
  const previousTotal = previousDeposits.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
  const change = previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : 0

  const totalFtd = filteredDeposits.reduce((sum, d) => sum + (Number((d as any).ftds) || 0), 0) // 🔁 Corrigido: ftds com 's'
  const totalCpa = filteredDeposits.reduce((sum, d) => sum + (Number(d.cpa) || 0), 0)
  const totalRev = filteredDeposits.reduce((sum, d) => sum + (Number(d.rev) || 0), 0)
  const estimatedCommission = filteredDeposits.reduce((sum, d) => sum + (Number(d.estimatedCommission) || 0), 0)
  const totalregistros = filteredDeposits.reduce((sum, d) => sum + (Number((d as any).registrations) || 0), 0)
  // Ordena do mais recente pro mais antigo
  const sortedByDate = [...filteredDeposits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  // Pega o valor da última linha (mais recente)
  const latestCliques = sortedByDate.length > 0 ? Number((sortedByDate[0] as any).cliques) || 0 : 0

  // ✅ Construindo o objeto final de KPIs
  const kpi: KPIData = {
    totalDeposits: total,
    ftds: totalFtd,
    cpas: totalCpa,
    estimatedCommission,
    revShare: totalRev,
    depositChange: change,
    cliques: latestCliques,
    registrations: totalregistros
  }

  return {
    kpi,
    deposits: filteredDeposits,
    referredUsers: raw.referredUsers
  }
}