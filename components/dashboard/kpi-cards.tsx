'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, DollarSign, Target, PiggyBank, Pencil, MousePointerClick } from 'lucide-react'
import type { KPIData } from '@/lib/mock-data'
import { Value } from '@radix-ui/react-select'

interface KPICardsProps {
  data: KPIData
}

export function KPICards({ data }: KPICardsProps) {
  const kpis = [
    {
      title: 'Total Deposits',
      value: `$${data.totalDeposits.toLocaleString()}`,
      icon: PiggyBank,
      description: 'Total deposits from referrals',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: `${(data.depositChange ?? 0) >= 0 ? '+' : ''}${(data.depositChange ?? 0).toFixed(1)}%`
    },
    {
      title: 'CPAs',
      value: data.cpas.toString(),
      icon: Target,
      description: 'Cost Per Acquisition conversions',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: ''
    },
    {
      title: 'FTDs',
      value: data.ftds.toString(),
      icon: Users,
      description: 'First Time Deposits',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: ''
    },
    {
      title: 'RevShare',
      value: `${(data.revShare ?? 0).toFixed(1)}%`,
      icon: TrendingUp,
      description: 'Revenue share percentage',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: ''
    },
    {
      title: 'Est. Commission',
      value: `$${data.estimatedCommission.toLocaleString()}`,
      icon: DollarSign,
      description: 'Estimated commission earned',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: ''
    },
    {
      title: 'Cliques',
      value: data.cliques.toString(),
      icon: MousePointerClick,
      description: 'Usuários registrados',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      change: ''
    },
    {
      title: 'Registros',
      value: data.registrations.toString(),
      icon: Pencil,
      description: 'Usuários registrados',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      change: ''
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card key={index} className="relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {kpi.value}
                  </div>
                  <p className="text-xs text-gray-500">
                    {kpi.description}
                  </p>
                </div>
                {kpi.change && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                  >
                    {kpi.change}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}