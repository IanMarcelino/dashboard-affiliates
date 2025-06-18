'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/header'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { DepositsChart } from '@/components/dashboard/deposits-chart'
import { UsersTable } from '@/components/dashboard/users-table'
import { DateFilter } from '@/components/dashboard/date-filter'
import { DateRange } from 'react-day-picker'
import { getFilteredData } from '@/lib/mock-data' // sua função de filtragem mock
import { mockAffiliateData } from '@/lib/mock-data' // seus dados mockados

import type { AffiliateData, KPIData, DailyDeposit, ReferredUser } from '@/lib/mock-data'

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [rawData, setRawData] = useState<AffiliateData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'custom'>('week')
  const [customRange, setCustomRange] = useState<DateRange | undefined>()
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('affiliate_session')
    if (!session) {
      router.push('/')
      return
    }

    try {
      const sessionData = JSON.parse(session)
      if (sessionData.expires <= Date.now()) {
        localStorage.removeItem('affiliate_session')
        router.push('/')
        return
      }

      setUserEmail(sessionData.user.email)
      setUserId(sessionData.user.id)

      // ✅ Usando mock direto
      setRawData(mockAffiliateData)
      setIsLoading(false)
    } catch (error) {
      localStorage.removeItem('affiliate_session')
      router.push('/')
    }
  }, [router])

  const filteredData = rawData
    ? getFilteredData(
        rawData,
        dateRange,
        customRange?.from,
        customRange?.to
      )
    : null

  if (isLoading || !filteredData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userEmail={userEmail} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Overview</h2>
          <p className="text-gray-600">Track your affiliate performance and commission earnings</p>
        </div>

        <DateFilter
          selectedRange={dateRange}
          onRangeChange={setDateRange}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
        />

        <KPICards data={filteredData.kpis!} />
        <DepositsChart data={filteredData.dailyDeposits} />
        <UsersTable data={filteredData.referredUsers} />
      </main>
    </div>
  )
}