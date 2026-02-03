"use client"

import { TerminalHeader } from "@/components/quantum/terminal-header"
import { ExecutionLog } from "@/components/quantum/execution-log"
import { QubitGrid } from "@/components/quantum/qubit-grid"
import { TerminalPriceChart } from "@/components/quantum/terminal-price-chart"
import { Terminal } from "lucide-react"

export default function QuantumHFTPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      {/* Page Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#333]">
        <Terminal className="w-5 h-5 text-[#888]" />
        <span className="text-sm text-white">quantum_hft_v1.0</span>
        <span className="text-[#888] text-xs">|</span>
        <span className="text-[#888] text-xs">NSE Connection: Active</span>
      </div>

      {/* Status Header */}
      <TerminalHeader />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        {/* Left Side - Execution Log */}
        <div className="lg:w-2/3 border-r border-[#333] flex flex-col">
          <div className="h-1/2 border-b border-[#333]">
            <ExecutionLog />
          </div>
          <div className="h-1/2">
            <TerminalPriceChart />
          </div>
        </div>

        {/* Right Side - Qubit Grid */}
        <div className="lg:w-1/3">
          <QubitGrid />
        </div>
      </div>
    </div>
  )
}
