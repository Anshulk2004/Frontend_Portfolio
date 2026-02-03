"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Briefcase, PiggyBank, LineChart, Shield } from "lucide-react"

const investments = [
  {
    type: "Stocks",
    icon: LineChart,
    invested: 466875,
    current: 520450,
    returns: 53575,
    returnPercent: 11.5,
    holdings: 24,
  },
  {
    type: "Mutual Funds",
    icon: Briefcase,
    invested: 259375,
    current: 290000,
    returns: 30625,
    returnPercent: 11.8,
    holdings: 8,
  },
  {
    type: "SIP",
    icon: PiggyBank,
    invested: 155625,
    current: 176660,
    returns: 21035,
    returnPercent: 13.5,
    holdings: 5,
  },
  {
    type: "Bonds",
    icon: Shield,
    invested: 103750,
    current: 109145,
    returns: 5395,
    returnPercent: 5.2,
    holdings: 3,
  },
]

export function InvestmentBreakdown() {
  const formatINR = (value: number) => {
    if (value >= 100000) {
      return `Rs. ${(value / 100000).toFixed(2)}L`
    }
    return `Rs. ${value.toLocaleString('en-IN')}`
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Investment Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investments.map((inv) => (
            <div
              key={inv.type}
              className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <inv.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{inv.type}</p>
                    <p className="text-sm text-muted-foreground">{inv.holdings} holdings</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${
                  inv.returnPercent >= 0 ? "text-success" : "text-destructive"
                }`}>
                  {inv.returnPercent >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">+{inv.returnPercent}%</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Invested</p>
                  <p className="font-medium text-foreground">{formatINR(inv.invested)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="font-medium text-foreground">{formatINR(inv.current)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Returns</p>
                  <p className="font-medium text-success">+{formatINR(inv.returns)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
