"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, IndianRupee, ArrowUpRight, Landmark } from "lucide-react"

interface InvestmentStatsProps {
  totalInvested: number
  totalCurrentValue: number
  totalReturns: number
  returnsPercentage: number
}

export function InvestmentStats({ 
  totalInvested, 
  totalCurrentValue, 
  totalReturns, 
  returnsPercentage 
}: InvestmentStatsProps) {
  const profit = totalReturns
  const percentage = returnsPercentage

  const cards = [
    { title: "Total Invested", val: totalInvested, sub: `${percentage.toFixed(1)}%`, icon: IndianRupee, trend: profit >= 0 ? "up" : "down" },
    { title: "Total Returns", val: profit, sub: `₹${profit.toLocaleString()}`, icon: TrendingUp, trend: profit >= 0 ? "up" : "down" },
    { title: "Net Profit", val: profit > 0 ? profit : 0, sub: `${percentage.toFixed(1)}%`, icon: ArrowUpRight, trend: "up" },
    { title: "Current Value", val: totalCurrentValue, sub: `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`, icon: Landmark, trend: profit >= 0 ? "up" : "down" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
      {cards.map((c) => (
        <Card key={c.title} className="shadow-none border-border/60">
          <CardContent className="p-4">
            <div className={`w-8 h-8 rounded-md mb-3 flex items-center justify-center ${c.trend === "up" ? "bg-emerald-50" : "bg-red-50"}`}>
              <c.icon className={`w-4 h-4 ${c.trend === "up" ? "text-emerald-600" : "text-red-600"}`} />
            </div>
            <p className="text-xl font-bold tracking-tight">{typeof c.val === "string" ? c.val : `₹${c.val.toLocaleString()}`}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">{c.title}</p>
            <div className={`flex items-center gap-1 text-[11px] font-bold mt-2 ${c.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
              {c.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{c.sub}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}