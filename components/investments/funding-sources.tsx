"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Building2, CreditCard, Landmark, Wallet } from "lucide-react"

const sources = [
  {
    name: "Chase Bank",
    amount: 45000,
    percentage: 36,
    icon: CreditCard,
    color: "#4F46E5",
    transactions: 24,
  },
  {
    name: "Bank of America",
    amount: 32000,
    percentage: 26,
    icon: Building2,
    color: "#10b981",
    transactions: 18,
  },
  {
    name: "Wells Fargo",
    amount: 28000,
    percentage: 22,
    icon: Landmark,
    color: "#f59e0b",
    transactions: 15,
  },
  {
    name: "Other Sources",
    amount: 19500,
    percentage: 16,
    icon: Wallet,
    color: "#8b5cf6",
    transactions: 12,
  },
]

const total = sources.reduce((acc, s) => acc + s.amount, 0)

export function FundingSources() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Funding Sources</CardTitle>
          <span className="text-sm text-muted-foreground">
            Total: ${total.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sources.map((source) => (
            <div key={source.name} className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${source.color}20` }}
                  >
                    <source.icon className="w-5 h-5" style={{ color: source.color }} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{source.name}</p>
                    <p className="text-sm text-muted-foreground">{source.transactions} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${source.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{source.percentage}%</p>
                </div>
              </div>
              <Progress value={source.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
