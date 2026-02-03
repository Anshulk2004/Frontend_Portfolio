"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts"
import { Filter } from "lucide-react"

const allStocks = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2485 },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3892 },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1678 },
  { symbol: "INFY", name: "Infosys", price: 1542 },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1125 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1456 },
  { symbol: "SBIN", name: "State Bank of India", price: 825 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: 1842 },
  { symbol: "LT", name: "Larsen & Toubro", price: 3425 },
  { symbol: "WIPRO", name: "Wipro", price: 485 },
]

export function StockChart() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>(
    allStocks.map((s) => s.symbol)
  )

  const toggleStock = (symbol: string) => {
    setSelectedStocks((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    )
  }

  const selectAll = () => {
    setSelectedStocks(allStocks.map((s) => s.symbol))
  }

  const clearAll = () => {
    setSelectedStocks([])
  }

  const chartData = allStocks
    .filter((stock) => selectedStocks.includes(stock.symbol))
    .map((stock) => ({
      name: stock.symbol,
      price: stock.price,
      fullName: stock.name,
    }))

  const formatINR = (value: number) => {
    return `Rs. ${value.toLocaleString("en-IN")}`
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">
            Market Overview
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Stock Price Comparison
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filter Stocks ({selectedStocks.length})
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Select Stocks</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={selectAll}
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={clearAll}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {allStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={stock.symbol}
                      checked={selectedStocks.includes(stock.symbol)}
                      onCheckedChange={() => toggleStock(stock.symbol)}
                    />
                    <label
                      htmlFor={stock.symbol}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {stock.symbol}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select at least one stock to view the chart
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Rs. ${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "var(--foreground)" }}
                  formatter={(value: number, _name: string, props: { payload: { fullName: string } }) => [
                    formatINR(value),
                    props.payload.fullName,
                  ]}
                  labelFormatter={(label) => `Stock: ${label}`}
                />
                <Bar
                  dataKey="price"
                  fill="var(--accent)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
