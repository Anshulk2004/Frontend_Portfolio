"use client"

import { useQuantumSocket } from "@/hooks/useQuantumSocket"
import { TerminalHeader } from "@/components/quantum/terminal-header"
import { ExecutionLog } from "@/components/quantum/execution-log"
import { QubitGrid } from "@/components/quantum/qubit-grid"
import { TerminalPriceChart } from "@/components/quantum/terminal-price-chart"
import { Terminal, Info } from "lucide-react"

// New Information Box Component
function HFTInfoBox() {
  return (
    <div className="p-4 m-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3 text-primary">
        <Info className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-widest">Market Intelligence</span>
      </div>
      <div className="space-y-3 font-mono text-[10px] sm:text-xs leading-relaxed">
        <p>
          <span className="text-primary font-bold">HFT (High-Frequency Trading)</span> is a method of trading that uses powerful computer programs to transact a large number of orders in fractions of a second.
        </p>
        <p>
          <span className="text-primary font-bold">Nifty 50 Utility:</span> These stocks are selected for HFT because they offer the highest <span className="underline">liquidity</span> and <span className="underline">trading volume</span> in the Indian market. This ensures that large orders can be executed with minimal "slippage" (price difference).
        </p>
        <div className="pt-2 border-t border-border opacity-70">
          <p>• Low Latency: Executions in microseconds (μs).</p>
          <p>• Arbitrage: Instant capture of Nifty Spot vs Futures gaps.</p>
          <p>• Algorithms: 100% automated quantum-simulated logic.</p>
        </div>
      </div>
    </div>
  )
}

export default function QuantumHFTPage() {
  // Use the custom hook to get real-time data from Python FastAPI
  const liveData = useQuantumSocket()

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Page Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 opacity-50" />
          <span className="text-sm font-bold tracking-tighter text-primary">QUANTUM_HFT_V2.0</span>
          <span className="opacity-30 text-xs">|</span>
          <span className="text-[10px] opacity-50 uppercase">Environment: Production</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${liveData ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[10px] opacity-70">
            {liveData ? "PYTHON_ENGINE_CONNECTED" : "ENGINE_OFFLINE"}
          </span>
        </div>
      </div>

      {/* Status Header (Passing liveData for Latency and PnL) */}
      <TerminalHeader liveData={liveData} />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] overflow-hidden">
        
        {/* Left Side - Real Time Execution & Charts */}
        <div className="lg:w-2/3 border-r border-border flex flex-col overflow-hidden">
          <div className="h-1/2 border-b border-border overflow-hidden">
            <ExecutionLog liveData={liveData} />
          </div>
          <div className="h-1/2 bg-card/20 overflow-hidden">
            <TerminalPriceChart liveData={liveData} />
          </div>
        </div>

        {/* Right Side - Visuals & Info */}
        <div className="lg:w-1/3 flex flex-col overflow-y-auto bg-card/10">
          {/* Decorative Quantum Visual */}
          <div className="border-b border-border">
            <QubitGrid />
          </div>
          
          {/* HFT Educational Content Box */}
          <HFTInfoBox />
          
          {/* Engine Metadata */}
          <div className="mt-auto p-4 opacity-30 text-[9px] font-mono uppercase border-t border-border">
            System: x86_64 Quantum Simulator <br />
            Connection: WebSocket/Secured <br />
            Tickers: Nifty_50_Top_10
          </div>
        </div>
      </div>
    </div>
  )
}