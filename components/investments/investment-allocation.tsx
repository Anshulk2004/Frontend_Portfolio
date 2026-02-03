"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Stocks", value: 45, amount: 466875, color: "#4F46E5" },
  { name: "Mutual Funds", value: 25, amount: 259375, color: "#10b981" },
  { name: "SIP", value: 15, amount: 155625, color: "#f59e0b" },
  { name: "Bonds", value: 10, amount: 103750, color: "#8b5cf6" },
  { name: "ETFs", value: 5, amount: 51875, color: "#06b6d4" },
]

export function InvestmentAllocation() {
  const formatINR = (value: number) => {
    if (value >= 100000) {
      return `Rs. ${(value / 100000).toFixed(2)}L`
    }
    return `Rs. ${value.toLocaleString('en-IN')}`
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Investment Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-1/2 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string, props: { payload: { amount: number } }) => [
                    `${value}% (${formatINR(props.payload.amount)})`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full lg:w-1/2 space-y-3">
            {data.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-foreground">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatINR(item.amount)}</p>
                  <p className="text-sm text-muted-foreground">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
