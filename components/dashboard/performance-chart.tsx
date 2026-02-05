"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

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

interface PerformanceChartProps {
  holdings: Holding[]
  onRefresh?: () => void
}

const timeFilters = [
  { label: "1D", value: "yesterday" },
  { label: "1W", value: "7d" },
  { label: "1M", value: "1mo" },
  { label: "3M", value: "3mo" },
  { label: "6M", value: "6mo" },
]

export function PerformanceChart({ holdings, onRefresh }: PerformanceChartProps) {
  const [activeFilter, setActiveFilter] = useState("1mo")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculate performance data based on today's holdings
  const performanceData = useMemo(() => {
    // Get today's holdings only (active stocks)
    const todayHoldings = holdings.filter(h => h.timePeriod === "today")
    
    // Get historical holdings for the selected period (for historical prices)
    const periodHoldings = holdings.filter(h => h.timePeriod === activeFilter)
    
    console.log('Active Filter:', activeFilter)
    console.log('Today Holdings:', todayHoldings.length)
    console.log('Period Holdings:', periodHoldings.length)
    
    // Create a map of historical prices by symbol
    const historicalPriceMap = new Map(
      periodHoldings.map(h => [h.symbol, h.currentPrice])
    )

    // Calculate P&L for each stock based on performance over the time period
    const stockPerformance = todayHoldings.map(holding => {
      const quantity = holding.quantity  // Today's quantity
      const acquiredPrice = holding.acquiredPrice  // Today's acquired price
      
      // For 1D (yesterday), use today's Flask price (already in holding.currentPrice)
      // For other periods, use historical price from holdings table
      const comparisonPrice = activeFilter === "yesterday"
        ? holding.currentPrice  // Flask API real-time price (already in today's holding)
        : (historicalPriceMap.get(holding.symbol) || holding.currentPrice)  // Historical price or fallback
      
      console.log(`Stock: ${holding.symbol}, Acquired: ${acquiredPrice}, Comparison: ${comparisonPrice}`)
      
      // Skip if no quantity or price data
      if (!quantity || !acquiredPrice || !comparisonPrice) {
        console.log(`Skipping ${holding.symbol} - missing data`)
        return null
      }

      // Calculate P&L: (comparison price - acquired price) × quantity
      const investedAmount = acquiredPrice * quantity
      const comparisonValue = comparisonPrice * quantity
      const pnl = comparisonValue - investedAmount

      console.log(`${holding.symbol} P&L:`, pnl)

      return {
        name: holding.symbol.replace('.NS', ''),
        companyName: holding.companyName,
        profit: pnl > 0 ? pnl : 0,
        loss: pnl < 0 ? Math.abs(pnl) : 0,
        pnl,
        currentValue: comparisonValue,
        investedAmount,
        acquiredPrice,
        currentPrice: comparisonPrice
      }
    }).filter(Boolean) as Array<{ name: string; companyName: string; profit: number; loss: number; pnl: number; currentValue: number; investedAmount: number; acquiredPrice?: number; currentPrice: number }>

    // Sort by absolute P&L and take top 6 performers
    return stockPerformance
      .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
      .slice(0, 6)
  }, [holdings, activeFilter])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      if (onRefresh) {
        await onRefresh()
      }
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000)
    }
  }

  const formatINR = (value: number) => {
    if (value >= 100000) {
      return `Rs. ${(value / 100000).toFixed(1)}L`
    }
    return `Rs. ${value.toLocaleString('en-IN')}`
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Performance Overview</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            {timeFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "ghost"}
                size="sm"
                className={`px-3 py-1 text-xs ${
                  activeFilter === filter.value
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={handleRefresh}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {performanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatINR}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "var(--foreground)" }}
                  formatter={(value: number, name: string) => [formatINR(value), name === "Profit" ? "Profit" : "Loss"]}
                />
                <Legend />
                <Bar dataKey="profit" name="Profit" fill="var(--success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="loss" name="Loss" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No data available for the selected period
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
