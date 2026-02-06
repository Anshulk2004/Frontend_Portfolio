"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMemo } from "react"

interface Holding {
  id: number
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

interface TopMoversProps {
  holdings?: Holding[]
}

export function TopMovers({ holdings = [] }: TopMoversProps) {
  const { gainers, losers } = useMemo(() => {
    // Filter only today's holdings
    const todayHoldings = holdings.filter(h => h.timePeriod === "today")
    
    // Calculate P&L percentage for each holding
    const stocksWithPnL = todayHoldings.map(holding => {
      const acquiredPrice = holding.acquiredPrice ?? (holding.totalInvested / holding.quantity)
      const currentValue = holding.currentPrice * holding.quantity
      const pnl = currentValue - holding.totalInvested
      const pnlPercentage = holding.totalInvested > 0 ? (pnl / holding.totalInvested) * 100 : 0
      
      return {
        symbol: holding.symbol,
        name: holding.companyName,
        change: pnlPercentage,
        price: holding.currentPrice
      }
    })
    
    // Sort and get top 4 gainers and losers
    const sortedGainers = [...stocksWithPnL]
      .filter(s => s.change > 0)
      .sort((a, b) => b.change - a.change)
      .slice(0, 4)
    
    const sortedLosers = [...stocksWithPnL]
      .filter(s => s.change < 0)
      .sort((a, b) => a.change - b.change)
      .slice(0, 4)
    
    return { gainers: sortedGainers, losers: sortedLosers }
  }, [holdings])

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value).replace('₹', 'Rs. ')
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Top Movers</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="gainers" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              Top Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              Top Losers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gainers" className="space-y-3">
            {gainers.length > 0 ? gainers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{stock.symbol.replace('.NS', '')}</p>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{formatINR(stock.price)}</p>
                  <p className="text-sm text-success flex items-center gap-1 justify-end">
                    <TrendingUp className="w-3 h-3" />
                    +{stock.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No gainers in your portfolio</p>
            )}
          </TabsContent>
          <TabsContent value="losers" className="space-y-3">
            {losers.length > 0 ? losers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{stock.symbol.replace('.NS', '')}</p>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{formatINR(stock.price)}</p>
                  <p className="text-sm text-destructive flex items-center gap-1 justify-end">
                    <TrendingDown className="w-3 h-3" />
                    {stock.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No losers in your portfolio</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
