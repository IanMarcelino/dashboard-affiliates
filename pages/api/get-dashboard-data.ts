import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-backend'

const NOTION_TOKEN = process.env.NOTION_TOKEN!
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!

type Deposit = {
  date: string
  btag: string
  activitiesCount: number
  adjustments: number
  balance: number
  bonusAmount: number
  cpa: number
  chargebacks: number
  commissionFromSubAff: number
  commissions: number
  deductions: number
  deposits: number
  depositsAmount: number
  amount: number // ✅ Adicionado para o gráfico
  ftdToLeadPercent: number
  ftds: number
  ftdsAmount: number
  netDeposits: number
  netPL: number
  payments: number
  qftdsCpa: number
  registrations: number
  revShare: number
  visitsUnique: number
  volume: number
  withdrawals: number
  withdrawalsAmount: number
  estimatedCommission: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  const {
    data: { user },
    error: userError
  } = await supabaseAdmin.auth.getUser(token)

  if (userError || !user) {
    return res.status(401).json({ error: 'Usuário não autenticado' })
  }

  const userId = user.id

  const { data: btags, error: btagError } = await supabaseAdmin
    .from('user')
    .select('btag')
    .eq('user_id', userId)

  if (btagError || !btags || btags.length === 0) {
    return res.status(404).json({ error: 'Nenhuma btag encontrada para este usuário' })
  }

  const btagList = btags.map(b => b.btag).filter(Boolean)
  const deposits: Deposit[] = []

  for (const btag of btagList) {
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: {
          property: 'btag',
          rich_text: {
            equals: btag
          }
        }
      })
    })

    const notionData = await notionRes.json()

    const mappedDeposits: Deposit[] = notionData.results.map((item: any): Deposit => {
      const get = (key: string) => item.properties[key]?.number ?? 0

      const cpa = get('CPA')
      const ftds = get('FTDs')
      const netPL = get('Net P&L')
      const revPercent = get('RevShare') // formato percentual

      const valorCPA = 25
      const valorFTD = 30

      const estimatedCommission = (cpa * valorCPA) + (ftds * valorFTD) + (netPL * (revPercent / 100))

      const depositsAmount = get('Deposits amount')

      return {
        date: item.properties['Date/Hora']?.date?.start || '',
        btag,
        activitiesCount: get('Activities count'),
        adjustments: get('Adjustments'),
        balance: get('Balance'),
        bonusAmount: get('Bonus amount'),
        cpa: get('CPA'),
        chargebacks: get('Chargebacks'),
        commissionFromSubAff: get('Commission from Sub Aff'),
        commissions: get('Commissions'),
        deductions: get('Deductions'),
        deposits: get('Deposits'),
        depositsAmount,
        amount: depositsAmount, // ✅ Aqui está o novo campo
        ftdToLeadPercent: get('FTD to Lead %'),
        ftds: get ('FTDs'),
        ftdsAmount: get('FTDs amount'),
        netDeposits: get('Net Deposits'),
        netPL,
        payments: get('Payments'),
        qftdsCpa: get('QFTDs CPA'),
        registrations: get('Registrations'),
        revShare: get('RevShare'),
        visitsUnique: get('Visits (unique)'),
        volume: get('Volume'),
        withdrawals: get('Withdrawals'),
        withdrawalsAmount: get('Withdrawals amount'),
        estimatedCommission
      }
    }).filter((dep: Deposit) => dep.depositsAmount > 0 && dep.date)

    deposits.push(...mappedDeposits)
  }

  return res.status(200).json({
    deposits,
    referredUsers: []
  })
}