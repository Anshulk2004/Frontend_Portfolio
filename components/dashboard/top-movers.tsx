"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

const gainers = [
  { symbol: "ADANIENT.NS", name: "Adani Enterprises", change: 5.82, price: 2845.75 },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", change: 4.15, price: 985.40 },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", change: 3.67, price: 1456.25 },
  { symbol: "RELIANCE.NS", name: "Reliance Industries", change: 2.89, price: 2485.75 },
]

const losers = [
  { symbol: "TATASTEEL.NS", name: "Tata Steel", change: -4.52, price: 142.85 },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel", change: -3.28, price: 892.45 },
  { symbol: "HINDALCO.NS", name: "Hindalco Industries", change: -2.75, price: 625.30 },
  { symbol: "COALINDIA.NS", name: "Coal India", change: -2.12, price: 478.90 },
]

export function TopMovers({ holdings }: TopMoversProps) {
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
            {gainers.map((stock) => (
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
                    +{stock.change}%
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="losers" className="space-y-3">
            {losers.map((stock) => (
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
                    {stock.change}%
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
