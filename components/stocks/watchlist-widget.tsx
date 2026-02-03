"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Eye } from "lucide-react"

const watchlist = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries", price: 2485.75, change: 1.33 },
  { symbol: "TCS.NS", name: "TCS", price: 3892.40, change: -1.15 },
  { symbol: "INFY.NS", name: "Infosys", price: 1542.35, change: -1.46 },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", price: 1456.25, change: 2.02 },
]

export function WatchlistWidget() {
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
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-accent" />
          <CardTitle className="text-lg font-semibold text-foreground">My Watchlist</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {watchlist.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
            >
              <div>
                <p className="font-medium text-foreground">{stock.symbol.replace('.NS', '')}</p>
                <p className="text-sm text-muted-foreground">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">{formatINR(stock.price)}</p>
                <p className={`text-sm flex items-center gap-1 justify-end ${
                  stock.change >= 0 ? "text-success" : "text-destructive"
                }`}>
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stock.change >= 0 ? "+" : ""}{stock.change}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
