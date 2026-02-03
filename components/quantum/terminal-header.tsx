"use client"

import { useState, useEffect } from "react"

export function TerminalHeader() {
  const [latency, setLatency] = useState(12.4)
  const [pnl, setPnl] = useState(0.0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Number.parseFloat((10 + Math.random() * 8).toFixed(1)))
      setPnl((prev) => {
        const change = (Math.random() - 0.48) * 0.02
        return Number.parseFloat((prev + change).toFixed(2))
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-6 py-3 px-4 border-b border-[#333] font-mono text-sm">
      <div className="flex items-center gap-2">
        <span className="text-[#888]">[System:</span>
        <span className="text-[#10b981]">Active</span>
        <span className="text-[#888]">]</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#888]">[Latency:</span>
        <span className="text-white">{latency}µs</span>
        <span className="text-[#888]">]</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#888]">[PnL:</span>
        <span className={pnl >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}>
          {pnl >= 0 ? "+" : ""}
          {pnl.toFixed(2)}%
        </span>
        <span className="text-[#888]">]</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#888]">[Circuit Breaker:</span>
        <span className="text-[#10b981]">OK</span>
        <span className="text-[#888]">]</span>
      </div>
    </div>
  )
}
