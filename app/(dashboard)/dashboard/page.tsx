"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { SectorAllocation } from "@/components/dashboard/sector-allocation"
import { HoldingsTable } from "@/components/dashboard/holdings-table"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
// import { QuarterAnalysis } from "@/components/dashboard/quarter-analysis"
import { TopMovers } from "@/components/dashboard/top-movers"

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

export default function DashboardPage() {
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

      // Create a map of stock symbols to current prices
      const priceMap = new Map(
        stockPrices.map((stock: any) => [stock.Symbol, stock.CurrentPrice])
      )

      // Update holdings with real-time prices
      const updatedHoldings = holdingsData.map((holding: Holding) => ({
        ...holding,
        currentPrice: priceMap.get(holding.symbol) || holding.currentPrice
      }))

      setHoldings(updatedHoldings)
    } catch (error) {
      console.error("Failed to fetch holdings:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter holdings by "today" for current snapshot
  const todayHoldings = holdings.filter(h => h.timePeriod === "today")

  // Calculate aggregated metrics
  const totalInvested = todayHoldings.reduce((sum, h) => sum + h.totalInvested, 0)
  const totalCurrentValue = todayHoldings.reduce((sum, h) => sum + (h.currentPrice * h.quantity), 0)
  const totalReturns = totalCurrentValue - totalInvested
  const returnsPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0
  const activePositions = todayHoldings.length

  // Calculate sector allocation
  const sectorData = todayHoldings.reduce((acc, h) => {
    const currentValue = h.currentPrice * h.quantity
    acc[h.sector] = (acc[h.sector] || 0) + currentValue
    return acc
  }, {} as Record<string, number>)

  const sectorAllocation = Object.entries(sectorData).map(([sector, value]) => ({
    sector,
    value,
    percentage: (value / totalCurrentValue) * 100
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Welcome back! Here&apos;s your portfolio overview.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards 
        totalInvested={totalInvested}
        totalReturns={totalReturns}
        totalCurrentValue={totalCurrentValue}
        returnsPercentage={returnsPercentage}
        activePositions={activePositions}
      />

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart holdings={holdings} onRefresh={fetchHoldings} />
        </div>
        <SectorAllocation sectorData={sectorAllocation} totalValue={totalCurrentValue} />
      </div>

      {/* Recent Transactions and Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RecentTransactions />
        <TopMovers />
      </div>

      {/* Holdings Table - Full Width */}
      <div>
        <HoldingsTable holdings={todayHoldings} onRefresh={fetchHoldings} />
      </div>
    </div>
  )
}