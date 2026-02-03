"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

interface Execution {
  id: string
  symbol: string
  action: "BUY" | "SELL"
  confidence: number
  executionTime: string
  price: number
  quantity: number
}

const generateExecution = (): Execution => {
  const symbols = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "BHARTIARTL", "SBIN", "BAJFINANCE"]
  const actions: ("BUY" | "SELL")[] = ["BUY", "SELL"]
  
  return {
    id: Math.random().toString(36).substring(7),
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    confidence: Math.floor(Math.random() * 30) + 70,
    executionTime: `${(Math.random() * 50 + 5).toFixed(1)}μs`,
    price: Math.floor(Math.random() * 3000) + 500,
    quantity: Math.floor(Math.random() * 100) + 10,
  }
}

export function LiveExecutions() {
  const [executions, setExecutions] = useState<Execution[]>([])

  useEffect(() => {
    const initial = Array.from({ length: 5 }, generateExecution)
    setExecutions(initial)
    const interval = setInterval(() => {
      setExecutions((prev) => {
        const newExecution = generateExecution()
        return [newExecution, ...prev.slice(0, 9)]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-[#0f0f19]/80 backdrop-blur-xl border-[#00f3ff]/20 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00f3ff]" />
            Live Executions
          </CardTitle>
          <Badge variant="outline" className="border-[#10b981] text-[#10b981] animate-pulse">
            STREAMING
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-hidden">
          {executions.map((execution, index) => (
            <div
              key={execution.id}
              className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f]/60 border border-[#00f3ff]/10 transition-all duration-500"
              style={{
                animation: index === 0 ? "slideIn 0.5s ease-out" : undefined,
                opacity: 1 - index * 0.08,
              }}
            >
              <div className="flex items-center gap-4">
                <div className="font-mono text-sm font-semibold text-white">
                  {execution.symbol}
                </div>
                <Badge
                  className={
                    execution.action === "BUY"
                      ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30"
                      : "bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30"
                  }
                >
                  {execution.action}
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-[#71717a] text-xs">Confidence</div>
                  <div className="font-mono text-[#00f3ff] font-semibold">
                    {execution.confidence}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[#71717a] text-xs">Price</div>
                  <div className="font-mono text-white">
                    ₹{execution.price.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[#71717a] text-xs">Qty</div>
                  <div className="font-mono text-white">
                    {execution.quantity}
                  </div>
                </div>
                <div className="text-center min-w-[70px]">
                  <div className="text-[#71717a] text-xs">Exec Time</div>
                  <div className="font-mono text-[#00f3ff] font-semibold">
                    {execution.executionTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <style jsx>{`
          @keyframes slideIn {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </CardContent>
    </Card>
  )
}
