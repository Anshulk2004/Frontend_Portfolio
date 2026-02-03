"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const timeFilters = ["1D", "1W", "1M", "3M", "6M", "1Y"]

// Stock-wise performance data
const data = {
  "1D": [
    { name: "RELIANCE", profit: 12500, loss: 0 },
    { name: "TCS", profit: 8200, loss: 0 },
    { name: "HDFCBANK", profit: 0, loss: 3500 },
    { name: "INFY", profit: 6800, loss: 0 },
    { name: "ICICIBANK", profit: 0, loss: 2100 },
    { name: "BHARTIARTL", profit: 4500, loss: 0 },
  ],
  "1W": [
    { name: "RELIANCE", profit: 45000, loss: 0 },
    { name: "TCS", profit: 32000, loss: 0 },
    { name: "HDFCBANK", profit: 0, loss: 12000 },
    { name: "INFY", profit: 28500, loss: 0 },
    { name: "ICICIBANK", profit: 18000, loss: 0 },
    { name: "WIPRO", profit: 0, loss: 8500 },
  ],
  "1M": [
    { name: "RELIANCE", profit: 125000, loss: 0 },
    { name: "TCS", profit: 98000, loss: 0 },
    { name: "HDFCBANK", profit: 0, loss: 35000 },
    { name: "INFY", profit: 78500, loss: 0 },
    { name: "TATASTEEL", profit: 0, loss: 42000 },
    { name: "BHARTIARTL", profit: 65000, loss: 0 },
  ],
  "3M": [
    { name: "RELIANCE", profit: 285000, loss: 0 },
    { name: "TCS", profit: 245000, loss: 0 },
    { name: "HDFCBANK", profit: 125000, loss: 0 },
    { name: "INFY", profit: 0, loss: 55000 },
    { name: "ICICIBANK", profit: 178000, loss: 0 },
    { name: "TATAMOTORS", profit: 0, loss: 85000 },
  ],
  "6M": [
    { name: "RELIANCE", profit: 485000, loss: 0 },
    { name: "TCS", profit: 425000, loss: 0 },
    { name: "HDFCBANK", profit: 285000, loss: 0 },
    { name: "INFY", profit: 225000, loss: 0 },
    { name: "ICICIBANK", profit: 0, loss: 95000 },
    { name: "BHARTIARTL", profit: 185000, loss: 0 },
  ],
  "1Y": [
    { name: "RELIANCE", profit: 850000, loss: 0 },
    { name: "TCS", profit: 725000, loss: 0 },
    { name: "HDFCBANK", profit: 485000, loss: 0 },
    { name: "INFY", profit: 425000, loss: 0 },
    { name: "ICICIBANK", profit: 385000, loss: 0 },
    { name: "TATASTEEL", profit: 0, loss: 125000 },
  ],
}

export function PerformanceChart() {
  const [activeFilter, setActiveFilter] = useState("1M")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const formatINR = (value: number) => {
    if (value >= 100000) {
      return `Rs. ${(value / 100000).toFixed(1)}L`
    }
    return `Rs. ${value.toLocaleString('en-IN')}`
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Performance Overview</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            {timeFilters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "ghost"}
                size="sm"
                className={`px-3 py-1 text-xs ${
                  activeFilter === filter
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={handleRefresh}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data[activeFilter as keyof typeof data]} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatINR}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
                formatter={(value: number) => [formatINR(value), value > 0 ? "Profit" : "Loss"]}
              />
              <Legend />
              <Bar dataKey="profit" name="Profit" fill="var(--success)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="loss" name="Loss" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
