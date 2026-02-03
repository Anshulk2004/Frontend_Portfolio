"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown } from "lucide-react"

const sectors = [
  { name: "IT Services", count: 8, change: 1.85, color: "#4F46E5" },
  { name: "Banking", count: 12, change: 0.92, color: "#10b981" },
  { name: "Oil & Gas", count: 5, change: -0.65, color: "#f59e0b" },
  { name: "Auto", count: 6, change: 2.45, color: "#ef4444" },
  { name: "Pharma", count: 4, change: 1.12, color: "#8b5cf6" },
  { name: "FMCG", count: 5, change: 0.45, color: "#06b6d4" },
]

const total = sectors.reduce((acc, s) => acc + s.count, 0)

export function SectorBreakdown() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Sector Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sectors.map((sector) => (
            <div key={sector.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sector.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{sector.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{sector.count} stocks</span>
                  <div className={`flex items-center gap-0.5 text-xs ${
                    sector.change >= 0 ? "text-success" : "text-destructive"
                  }`}>
                    {sector.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {sector.change >= 0 ? "+" : ""}{sector.change}%
                  </div>
                </div>
              </div>
              <Progress
                value={(sector.count / total) * 100}
                className="h-2"
                style={{
                  // @ts-ignore
                  "--progress-background": sector.color,
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
