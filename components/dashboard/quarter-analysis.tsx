"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, Calendar } from "lucide-react"

const quarterData = [
  {
    quarter: "Q1 2024",
    revenue: 32500,
    target: 30000,
    growth: 12.5,
    status: "achieved",
  },
  {
    quarter: "Q2 2024",
    revenue: 28400,
    target: 32000,
    growth: -8.2,
    status: "missed",
  },
  {
    quarter: "Q3 2024",
    revenue: 38200,
    target: 35000,
    growth: 18.4,
    status: "achieved",
  },
  {
    quarter: "Q4 2024",
    revenue: 24500,
    target: 40000,
    growth: 0,
    status: "in-progress",
  },
]

export function QuarterAnalysis() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Quarter Analysis</CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>FY 2024</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quarterData.map((quarter) => {
            const progressPercent = Math.min((quarter.revenue / quarter.target) * 100, 100)
            return (
              <div key={quarter.quarter} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{quarter.quarter}</span>
                    {quarter.status === "achieved" && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-success/10 text-success">
                        Achieved
                      </span>
                    )}
                    {quarter.status === "missed" && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-destructive/10 text-destructive">
                        Missed
                      </span>
                    )}
                    {quarter.status === "in-progress" && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-warning/10 text-warning">
                        In Progress
                      </span>
                    )}
                  </div>
                  {quarter.growth !== 0 && (
                    <div className={`flex items-center gap-1 text-sm ${
                      quarter.growth > 0 ? "text-success" : "text-destructive"
                    }`}>
                      {quarter.growth > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{quarter.growth > 0 ? "+" : ""}{quarter.growth}%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress 
                      value={progressPercent} 
                      className="h-2"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground font-medium">${(quarter.revenue / 1000).toFixed(1)}k</span>
                    <span className="text-muted-foreground">/</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Target className="w-3 h-3" />
                      <span>${(quarter.target / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
