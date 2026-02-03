"use client"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

const tickers = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS"]

const basePrices: Record<string, number> = {
  "RELIANCE.NS": 2450,
  "TCS.NS": 3890,
  "HDFCBANK.NS": 1720,
  "INFY.NS": 1580,
  "ICICIBANK.NS": 1120,
}

function generateInitialData(ticker: string) {
  const base = basePrices[ticker] || 1000
  const data = []
  let price = base
  for (let i = 0; i < 60; i++) {
    price = price + (Math.random() - 0.5) * (base * 0.002)
    data.push({
      time: i,
      price: Number.parseFloat(price.toFixed(2)),
    })
  }
  return data
}

export function TerminalPriceChart() {
  const [selectedTicker, setSelectedTicker] = useState("RELIANCE.NS")
  const [data, setData] = useState(() => generateInitialData("RELIANCE.NS"))

  useEffect(() => {
    setData(generateInitialData(selectedTicker))
  }, [selectedTicker])

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const lastPrice = prev[prev.length - 1].price
        const base = basePrices[selectedTicker] || 1000
        const newPrice = lastPrice + (Math.random() - 0.5) * (base * 0.002)
        const newData = [
          ...prev.slice(1),
          {
            time: prev[prev.length - 1].time + 1,
            price: Number.parseFloat(newPrice.toFixed(2)),
          },
        ]
        return newData
      })
    }, 500)
    return () => clearInterval(interval)
  }, [selectedTicker])

  const currentPrice = data[data.length - 1]?.price || 0
  const startPrice = data[0]?.price || 0
  const change = currentPrice - startPrice
  const changePercent = ((change / startPrice) * 100).toFixed(2)

  return (
    <div className="flex flex-col h-full">
      <div className="py-2 px-3 border-b border-[#333] flex items-center justify-between">
        <span className="font-mono text-xs text-[#888]">PRICE_CHART</span>
        <div className="flex items-center gap-2">
          {tickers.map((ticker) => (
            <button
              key={ticker}
              type="button"
              onClick={() => setSelectedTicker(ticker)}
              className={`font-mono text-xs px-2 py-1 border transition-colors ${
                selectedTicker === ticker
                  ? "border-[#10b981] text-[#10b981]"
                  : "border-[#333] text-[#888] hover:text-white hover:border-[#555]"
              }`}
            >
              {ticker.replace(".NS", "")}
            </button>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 border-b border-[#333] flex items-center gap-4">
        <span className="font-mono text-sm text-white">{selectedTicker}</span>
        <span className="font-mono text-sm text-white">₹{currentPrice.toFixed(2)}</span>
        <span
          className={`font-mono text-xs ${change >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)} ({changePercent}%)
        </span>
      </div>
      <div className="flex-1 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis
              domain={["auto", "auto"]}
              hide
            />
            <ReferenceLine y={startPrice} stroke="#333" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="price"
              stroke={change >= 0 ? "#10b981" : "#ef4444"}
              strokeWidth={1}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
