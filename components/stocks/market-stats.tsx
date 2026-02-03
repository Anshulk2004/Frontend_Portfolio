"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, BarChart3, Globe, Clock } from "lucide-react"

const stats = [
  {
    title: "NIFTY 50",
    value: "22,456.80",
    change: "+0.82%",
    trend: "up",
    icon: BarChart3,
  },
  {
    title: "SENSEX",
    value: "73,892.45",
    change: "+0.75%",
    trend: "up",
    icon: Activity,
  },
  {
    title: "NIFTY Bank",
    value: "47,125.30",
    change: "-0.35%",
    trend: "down",
    icon: TrendingDown,
  },
  {
    title: "India VIX",
    value: "12.85",
    change: "-5.42%",
    trend: "down",
    icon: Activity,
  },
  {
    title: "Market Cap",
    value: "Rs. 385L Cr",
    change: "+1.12%",
    trend: "up",
    icon: Globe,
  },
  {
    title: "Volume",
    value: "45.2 Cr",
    change: "+8.25%",
    trend: "up",
    icon: Clock,
  },
]

export function MarketStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
              <stat.icon className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
              <span className="text-xs md:text-sm text-muted-foreground truncate">{stat.title}</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-foreground">{stat.value}</p>
            <div className={`flex items-center gap-1 text-xs md:text-sm ${
              stat.trend === "up" ? "text-success" : "text-destructive"
            }`}>
              {stat.trend === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {stat.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
