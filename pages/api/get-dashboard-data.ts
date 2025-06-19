import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// 🔐 Supabase setup (lembre-se: SERVICE ROLE no backend)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const NOTION_TOKEN = process.env.NOTION_TOKEN!
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!

// ✅ Tipo completo com todos os campos da planilha
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

  // ✅ Autentica o usuário
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser(token)

  if (userError || !user) {
    return res.status(401).json({ error: 'Usuário não autenticado' })
  }

  const userId = user.id

  // ✅ Busca btags associadas ao usuário
  const { data: btags, error: btagError } = await supabase
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

    const mappedDeposits: Deposit[] = notionData.results
      .map((item: any): Deposit => ({
        date: item.properties['Date/Hora']?.date?.start || '',
        btag,
        activitiesCount: item.properties['Activities count']?.number ?? 0,
        adjustments: item.properties['Adjustments']?.number ?? 0,
        balance: item.properties['Balance']?.number ?? 0,
        bonusAmount: item.properties['Bonus amount']?.number ?? 0,
        cpa: item.properties['CPA']?.number ?? 0,
        chargebacks: item.properties['Chargebacks']?.number ?? 0,
        commissionFromSubAff: item.properties['Commission from Sub Aff']?.number ?? 0,
        commissions: item.properties['Commissions']?.number ?? 0,
        deductions: item.properties['Deductions']?.number ?? 0,
        deposits: item.properties['Deposits']?.number ?? 0,
        depositsAmount: item.properties['Deposits amount']?.number ?? 0,
        ftdToLeadPercent: item.properties['FTD to Lead %']?.number ?? 0,
        ftds: item.properties['FTDs']?.number ?? 0,
        ftdsAmount: item.properties['FTDs amount']?.number ?? 0,
        netDeposits: item.properties['Net Deposits']?.number ?? 0,
        netPL: item.properties['Net P&L']?.number ?? 0,
        payments: item.properties['Payments']?.number ?? 0,
        qftdsCpa: item.properties['QFTDs CPA']?.number ?? 0,
        registrations: item.properties['Registrations']?.number ?? 0,
        revShare: item.properties['RevShare']?.number ?? 0,
        visitsUnique: item.properties['Visits (unique)']?.number ?? 0,
        volume: item.properties['Volume']?.number ?? 0,
        withdrawals: item.properties['Withdrawals']?.number ?? 0,
        withdrawalsAmount: item.properties['Withdrawals amount']?.number ?? 0
      }))
      .filter((dep: Deposit) => dep.depositsAmount > 0 && dep.date)

    deposits.push(...mappedDeposits)
  }

  return res.status(200).json({
    deposits,
    referredUsers: []
  })
}