"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { month: "Jan", returns: 20400 },
  { month: "Feb", returns: 26650 },
  { month: "Mar", returns: 23330 },
  { month: "Apr", returns: 34170 },
  { month: "May", returns: 30000 },
  { month: "Jun", returns: 40000 },
  { month: "Jul", returns: 32500 },
  { month: "Aug", returns: 43330 },
  { month: "Sep", returns: 37500 },
  { month: "Oct", returns: 48330 },
  { month: "Nov", returns: 51670 },
  { month: "Dec", returns: 31830 },
]

export function MonthlyReturns() {
  const formatINR = (value: number) => {
    if (value >= 100000) {
      return `Rs. ${(value / 100000).toFixed(1)}L`
    }
    return `Rs. ${(value / 1000).toFixed(0)}K`
  }

  const totalReturns = data.reduce((sum, d) => sum + d.returns, 0)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Monthly Returns</CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-semibold text-success">Rs. {(totalReturns / 100000).toFixed(2)}L</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="month"
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
                formatter={(value: number) => [`Rs. ${value.toLocaleString('en-IN')}`, "Returns"]}
              />
              <Area
                type="monotone"
                dataKey="returns"
                stroke="var(--success)"
                strokeWidth={2}
                fill="url(#colorReturns)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
