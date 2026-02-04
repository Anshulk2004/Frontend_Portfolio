"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  PiggyBank,
  Calendar,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const stats = [
  {
    title: "Total Invested",
    value: "Rs. 10,37,500",
    change: "+Rs. 68,750",
    changePercent: "+7.1%",
    trend: "up",
    icon: IndianRupee,
    description: "All time investment",
  },
  {
    title: "Total Returns",
    value: "Rs. 1,52,000",
    change: "+Rs. 20,400",
    changePercent: "+15.5%",
    trend: "up",
    icon: TrendingUp,
    description: "Cumulative returns",
  },
  {
    title: "This Month",
    value: "Rs. 31,830",
    change: "+Rs. 4,830",
    changePercent: "+17.9%",
    trend: "up",
    icon: Calendar,
    description: "Monthly returns",
  },
  // {
  //   title: "Avg. Returns",
  //   value: "12.4%",
  //   change: "+2.1%",
  //   changePercent: "",
  //   trend: "up",
  //   icon: Percent,
  //   description: "Annual average",
  // },
  {
    title: "Net Profit",
    value: "Rs. 1,28,500",
    change: "+Rs. 15,420",
    changePercent: "+13.6%",
    trend: "up",
    icon: ArrowUpRight,
    description: "After fees",
  },
  {
    title: "Net Loss",
    value: "Rs. 23,500",
    change: "-Rs. 2,670",
    changePercent: "-10.2%",
    trend: "down",
    icon: ArrowDownRight,
    description: "Total losses",
  },
]

export function InvestmentStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${
                stat.trend === "up" ? "bg-success/10" : "bg-destructive/10"
              }`}>
                <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${
                  stat.trend === "up" ? "text-success" : "text-destructive"
                }`} />
              </div>
            </div>
            <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.title}</p>
            <div className={`flex items-center gap-1 text-xs md:text-sm ${
              stat.trend === "up" ? "text-success" : "text-destructive"
            }`}>
              {stat.trend === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{stat.change}</span>
              {stat.changePercent && (
                <span className="text-muted-foreground hidden sm:inline">({stat.changePercent})</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
