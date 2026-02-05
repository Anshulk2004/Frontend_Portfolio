"use client"

import { InvestmentStats } from "@/components/investments/investment-stats"
import { InvestmentAllocation } from "@/components/investments/investment-allocation"
import { WalletCards } from "@/components/investments/wallet-cards"
import { PersonalGoals } from "@/components/investments/personal-goals"
import { InvestmentBreakdown } from "@/components/investments/investment-breakdown"
import { useState, useEffect } from "react"
import axios from "axios"
import { Loader2 } from "lucide-react"

interface Holding {
  id: number
  user?: {
    id: number
  }
  symbol: string
  companyName: string
  sector: string
  currentPrice: number
  timePeriod: string
  quantity: number
  totalInvested: number
  acquiredPrice?: number
  acquiredDate: string
  updatedAt: string
}

export default function InvestmentsPage() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHoldings()
  }, [])

  const fetchHoldings = async () => {
    try {
      setLoading(true)
      const [holdingsResponse, stockDataResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/holdings"),
        axios.get("http://localhost:8080/api/flask/stock-data")
      ])

      const holdingsData = holdingsResponse.data
      const stockPrices = stockDataResponse.data
      const priceMap = new Map(
        stockPrices.map((stock: any) => [stock.Symbol, stock.CurrentPrice])
      )
      const updatedHoldings = holdingsData.map((holding: Holding) => {
        if (holding.timePeriod === "today") {
          return {
            ...holding,
            currentPrice: priceMap.get(holding.symbol) || holding.currentPrice
          }
        }
        return holding
      })

      setHoldings(updatedHoldings)
    } catch (error) {
      console.error("Failed to fetch holdings:", error)
    } finally {
      setLoading(false)
    }
  }

  const todayHoldings = holdings.filter(h => h.timePeriod === "today")
  const totalInvested = todayHoldings.reduce((sum, h) => sum + h.totalInvested, 0)
  const totalCurrentValue = todayHoldings.reduce((sum, h) => sum + (h.currentPrice * h.quantity), 0)
  const totalReturns = totalCurrentValue - totalInvested
  const returnsPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Investments</h1>
        <p className="text-muted-foreground">Portfolio overview and asset management</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <InvestmentStats 
            totalInvested={totalInvested}
            totalCurrentValue={totalCurrentValue}
            totalReturns={totalReturns}
            returnsPercentage={returnsPercentage}
          />
          
          <WalletCards onRefresh={fetchHoldings} />

          {/* Side-by-Side Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <InvestmentAllocation holdings={todayHoldings} totalCurrentValue={totalCurrentValue} />
            <PersonalGoals />
          </div>

          <InvestmentBreakdown />
        </>
      )}
    </div>
  )
}