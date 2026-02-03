"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, TrendingUp, Activity } from "lucide-react"

export function RiskManagement() {
  const [pnl, setPnl] = useState(1.24)
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState<"ARMED" | "TRIGGERED" | "STANDBY">("ARMED")
  const [riskMetrics, setRiskMetrics] = useState({
    maxDrawdown: 2.5,
    sharpeRatio: 1.87,
    winRate: 68.4,
    avgHoldTime: "2.3μs",
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setPnl((prev) => {
        const change = (Math.random() - 0.45) * 0.1
        return Math.max(-5, Math.min(10, prev + change))
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-[#0f0f19]/80 backdrop-blur-xl border-[#00f3ff]/20 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#00f3ff]" />
          Risk Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circuit Breaker Status */}
        <div className="p-4 rounded-lg bg-[#0a0a0f]/60 border border-[#00f3ff]/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#71717a] text-sm">Circuit Breaker</span>
            <Badge
              className={
                circuitBreakerStatus === "ARMED"
                  ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30"
                  : circuitBreakerStatus === "TRIGGERED"
                  ? "bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30 animate-pulse"
                  : "bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30"
              }
            >
              {circuitBreakerStatus === "ARMED" && <Shield className="w-3 h-3 mr-1" />}
              {circuitBreakerStatus === "TRIGGERED" && <AlertTriangle className="w-3 h-3 mr-1" />}
              {circuitBreakerStatus}
            </Badge>
          </div>
          <div className="flex gap-2">
            {["ARMED", "STANDBY", "TRIGGERED"].map((status) => (
              <button
                key={status}
                onClick={() => setCircuitBreakerStatus(status as typeof circuitBreakerStatus)}
                className={`flex-1 py-1.5 px-2 rounded text-xs font-mono transition-all ${
                  circuitBreakerStatus === status
                    ? "bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/40"
                    : "bg-[#1a1a2e] text-[#71717a] border border-[#27272a] hover:border-[#00f3ff]/30"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Session PnL */}
        <div className="p-4 rounded-lg bg-[#0a0a0f]/60 border border-[#00f3ff]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#71717a] text-sm">Session PnL</span>
            <TrendingUp className={`w-4 h-4 ${pnl >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`} />
          </div>
          <div
            className={`text-3xl font-mono font-bold ${
              pnl >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
            }`}
          >
            {pnl >= 0 ? "+" : ""}
            {pnl.toFixed(2)}%
          </div>
          <div className="mt-2 h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                pnl >= 0 ? "bg-[#10b981]" : "bg-[#ef4444]"
              }`}
              style={{
                width: `${Math.min(100, Math.abs(pnl) * 10)}%`,
                boxShadow: pnl >= 0 
                  ? "0 0 10px rgba(16, 185, 129, 0.5)" 
                  : "0 0 10px rgba(239, 68, 68, 0.5)",
              }}
            />
          </div>
        </div>

        {/* Risk Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[#0a0a0f]/60 border border-[#00f3ff]/10">
            <div className="text-[#71717a] text-xs mb-1">Max Drawdown</div>
            <div className="text-[#ef4444] font-mono font-semibold">
              -{riskMetrics.maxDrawdown}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#0a0a0f]/60 border border-[#00f3ff]/10">
            <div className="text-[#71717a] text-xs mb-1">Sharpe Ratio</div>
            <div className="text-[#00f3ff] font-mono font-semibold">
              {riskMetrics.sharpeRatio}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#0a0a0f]/60 border border-[#00f3ff]/10">
            <div className="text-[#71717a] text-xs mb-1">Win Rate</div>
            <div className="text-[#10b981] font-mono font-semibold">
              {riskMetrics.winRate}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#0a0a0f]/60 border border-[#00f3ff]/10">
            <div className="text-[#71717a] text-xs mb-1">Avg Hold Time</div>
            <div className="text-[#00f3ff] font-mono font-semibold">
              {riskMetrics.avgHoldTime}
            </div>
          </div>
        </div>

        {/* Daily Limits */}
        <div className="p-4 rounded-lg bg-[#0a0a0f]/60 border border-[#00f3ff]/10">
          <div className="text-[#71717a] text-sm mb-3">Daily Limits</div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#71717a]">Trade Volume</span>
                <span className="text-white font-mono">₹4.2Cr / ₹10Cr</span>
              </div>
              <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00f3ff] to-[#10b981] rounded-full"
                  style={{ width: "42%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#71717a]">Executions</span>
                <span className="text-white font-mono">1,247 / 5,000</span>
              </div>
              <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00f3ff] to-[#10b981] rounded-full"
                  style={{ width: "25%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
