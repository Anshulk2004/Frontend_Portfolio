"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface InvestmentStatsProps {
  totalInvested: number
  totalReturns: number
  returnsPercentage: number
}

export function InvestmentStats({ totalInvested, totalReturns, returnsPercentage }: InvestmentStatsProps) {
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value).replace('₹', 'Rs. ')
  }

  const netProfit = totalReturns > 0 ? totalReturns : 0
  const netLoss = totalReturns < 0 ? Math.abs(totalReturns) : 0

  const stats = [
    {
      title: "Total Invested",
      value: formatINR(totalInvested),
      change: totalInvested > 0 ? `${returnsPercentage > 0 ? '+' : ''}${returnsPercentage.toFixed(2)}%` : "0%",
      trend: totalReturns >= 0 ? "up" : "down",
      icon: IndianRupee,
      description: "All time investment",
    },
    {
      title: "Total Returns",
      value: formatINR(totalReturns),
      change: `${totalReturns >= 0 ? '+' : ''}${formatINR(totalReturns)}`,
      trend: totalReturns >= 0 ? "up" : "down",
      icon: TrendingUp,
      description: "Cumulative returns",
    },
    {
      title: "Net Profit",
      value: formatINR(netProfit),
      change: `${returnsPercentage >= 0 ? '+' : ''}${returnsPercentage.toFixed(2)}%`,
      trend: "up",
      icon: ArrowUpRight,
      description: "Profit earned",
    },
    {
      title: "Net Loss",
      value: formatINR(netLoss),
      change: netLoss > 0 ? `-${formatINR(netLoss)}` : formatINR(0),
      trend: "down",
      icon: ArrowDownRight,
      description: "Total losses",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
              <span className="truncate">{stat.change}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
