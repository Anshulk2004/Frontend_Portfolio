"use client"
import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts"

export function TerminalPriceChart({ liveData }: { liveData: any }) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (liveData) {
      setChartData((prev) => {
        const newData = [...prev, { time: liveData.timestamp, price: liveData.price }]
        return newData.slice(-30); // Keep last 30 data points
      })
    }
  }, [liveData])

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="py-2 px-3 border-b border-border flex justify-between">
        <span className="font-mono text-xs opacity-50">LIVE_PRICE_STREAM: {liveData?.ticker || "WAITING..."}</span>
        <span className="font-mono text-xs text-primary">₹{liveData?.price || "0.00"}</span>
      </div>
      <div className="flex-1 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Line 
              type="stepAfter" 
              dataKey="price" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}