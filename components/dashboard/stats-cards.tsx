"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, IndianRupee, ArrowUpRight, Wallet, Activity } from "lucide-react"

interface StatsCardsProps {
  totalInvested: number
  totalReturns: number
  totalCurrentValue: number
  returnsPercentage: number
  activePositions: number
}

export function StatsCards({
  totalInvested,
  totalReturns,
  totalCurrentValue,
  returnsPercentage,
  activePositions
}: StatsCardsProps) {
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const stats = [
    {
      title: "Total Invested",
      value: formatINR(totalInvested),
      change: "+12.5%",
      trend: "up",
      icon: IndianRupee,
      description: "Since last month",
    },
    {
      title: "Total Returns",
      value: formatINR(totalReturns),
      change: `${returnsPercentage >= 0 ? '+' : ''}${returnsPercentage.toFixed(2)}%`,
      trend: totalReturns >= 0 ? "up" : "down",
      icon: TrendingUp,
      description: "All time returns",
    },
    {
      title: "Portfolio Value",
      value: formatINR(totalCurrentValue),
      change: `${returnsPercentage >= 0 ? '+' : ''}${returnsPercentage.toFixed(2)}%`,
      trend: totalReturns >= 0 ? "up" : "down",
      icon: Wallet,
      description: "Current value",
    },
    {
      title: "Active Positions",
      value: activePositions.toString(),
      change: "+3",
      trend: "up",
      icon: Activity,
      description: "Open positions",
    },
    {
      title: "P&L",
      value: formatINR(totalReturns),
      change: `${returnsPercentage >= 0 ? '+' : ''}${returnsPercentage.toFixed(2)}%`,
      trend: totalReturns >= 0 ? "up" : "down",
      icon: totalReturns >= 0 ? TrendingUp : TrendingDown,
      description: "Profit & Loss",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-accent" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs md:text-sm font-medium ${
                  stat.trend === "up" ? "text-success" : "text-destructive"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                ) : (
                  <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-2 md:mt-3">
              <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
