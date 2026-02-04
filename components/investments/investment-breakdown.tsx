"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, ExternalLink, Coins, TrendingUp, Landmark } from "lucide-react"
import Link from "next/link"

const breakdownData = [
  {
    category: "Stocks",
    type: "Equity",
    value: 842000,
    invested: 620000,
    count: 18,
    icon: TrendingUp,
    href: "/dashboard",
  },
  {
    category: "Parag Parikh Flexi Cap",
    type: "Mutual Fund",
    value: 245000,
    invested: 180000,
    count: 1,
    icon: Landmark,
    canOperate: true,
  },
  {
    category: "Mirae Asset Large Cap",
    type: "Mutual Fund",
    value: 182000,
    invested: 150000,
    count: 1,
    icon: Landmark,
    canOperate: true,
  },
  {
    category: "Physical Gold",
    type: "Precious Metal",
    value: 320000,
    invested: 240000,
    count: "40g",
    icon: Coins,
    canOperate: true,
  },
  {
    category: "Silver ETF",
    type: "Precious Metal",
    value: 45000,
    invested: 38000,
    count: "1kg eq.",
    icon: Coins,
    canOperate: true,
  }
]

export function InvestmentBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Asset Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {breakdownData.map((item, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border bg-muted/20 hover:bg-muted/30 transition-colors gap-4">
            <div className="flex items-center gap-4 w-full md:w-1/3">
              <div className="p-2 rounded-lg bg-background border shadow-sm">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none mb-1">{item.category}</h4>
                <p className="text-xs text-muted-foreground">{item.type} • {item.count}</p>
              </div>
            </div>

            <div className="flex justify-around w-full md:w-1/3 text-center">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Current</p>
                <p className="text-sm font-semibold text-success">Rs. {item.value.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Invested</p>
                <p className="text-sm font-semibold">Rs. {item.invested.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end w-full md:w-1/3">
              {item.href ? (
                <Button asChild variant="outline" size="sm" className="w-full md:w-auto">
                  <Link href={item.href}>
                    View Details <ExternalLink className="w-3 h-3 ml-2" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="h-8 border-success/50 text-success hover:bg-success/10">
                    <Plus className="w-3 h-3 mr-1" /> Buy
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 border-destructive/50 text-destructive hover:bg-destructive/10">
                    <Minus className="w-3 h-3 mr-1" /> Sell
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}