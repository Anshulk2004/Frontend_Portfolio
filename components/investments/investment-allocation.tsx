"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Stocks", value: 466875, color: "#4F46E5" },
  { name: "Mutual Funds", value: 259375, color: "#10b981" },
  { name: "Gold & Silver", value: 155625, color: "#f59e0b" },
]

export function InvestmentAllocation() {
  const total = data.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `Rs. ${value.toLocaleString('en-IN')}`}
                contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-foreground">Rs. {total.toLocaleString('en-IN')}</p>
        </div>
      </CardContent>
    </Card>
  )
}