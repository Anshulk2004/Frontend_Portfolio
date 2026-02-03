"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Cpu, Activity, Zap, Clock } from "lucide-react"

export function StatusHeader() {
  const [latency, setLatency] = useState(12.4)
  const [uptime, setUptime] = useState("04:23:17")
  const [qubitsActive, setQubitsActive] = useState(64)

  useEffect(() => {
    const latencyInterval = setInterval(() => {
      setLatency((prev) => {
        const change = (Math.random() - 0.5) * 2
        return Math.max(5, Math.min(50, prev + change))
      })
    }, 100)

    const uptimeInterval = setInterval(() => {
      setUptime((prev) => {
        const [h, m, s] = prev.split(":").map(Number)
        let newS = s + 1
        let newM = m
        let newH = h
        if (newS >= 60) {
          newS = 0
          newM++
        }
        if (newM >= 60) {
          newM = 0
          newH++
        }
        return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}:${String(newS).padStart(2, "0")}`
      })
    }, 1000)

    return () => {
      clearInterval(latencyInterval)
      clearInterval(uptimeInterval)
    }
  }, [])

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-xl bg-[#0f0f19]/80 backdrop-blur-xl border border-[#00f3ff]/20 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
      {/* Quantum Simulator Status */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-[#0a0a0f] border border-[#00f3ff]/30 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-[#00f3ff]" />
          </div>
          {/* Pulsing glow effect */}
          <div className="absolute -inset-1 rounded-xl bg-[#10b981]/20 animate-pulse -z-10" />
          <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981,0_0_20px_#10b981]">
            <div className="absolute inset-0 rounded-full bg-[#10b981] animate-ping" />
          </div>
        </div>
        <div>
          <div className="text-[#71717a] text-xs uppercase tracking-wider">Quantum Simulator</div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-lg">ONLINE</span>
            <Badge className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30 text-xs">
              64 Qubits
            </Badge>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex flex-wrap items-center gap-6">
        {/* System Latency */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#0a0a0f]/60 border border-[#00f3ff]/10">
          <Zap className="w-4 h-4 text-[#00f3ff]" />
          <div>
            <div className="text-[#71717a] text-xs">System Latency</div>
            <div className="font-mono text-[#00f3ff] font-bold text-lg">
              {latency.toFixed(1)}
              <span className="text-xs ml-0.5">μs</span>
            </div>
          </div>
        </div>

        {/* Uptime */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#0a0a0f]/60 border border-[#00f3ff]/10">
          <Clock className="w-4 h-4 text-[#10b981]" />
          <div>
            <div className="text-[#71717a] text-xs">Session Uptime</div>
            <div className="font-mono text-[#10b981] font-bold text-lg">{uptime}</div>
          </div>
        </div>

        {/* Throughput */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#0a0a0f]/60 border border-[#00f3ff]/10">
          <Activity className="w-4 h-4 text-[#00f3ff]" />
          <div>
            <div className="text-[#71717a] text-xs">Throughput</div>
            <div className="font-mono text-[#00f3ff] font-bold text-lg">
              1.2M
              <span className="text-xs ml-0.5">ops/s</span>
            </div>
          </div>
        </div>

        {/* Market Connection */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30">
          <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-[#10b981] text-sm font-medium">NSE Connected</span>
        </div>
      </div>
    </div>
  )
}
