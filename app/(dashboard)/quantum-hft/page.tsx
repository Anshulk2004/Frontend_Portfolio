"use client"

import React from "react"
import { useQuantumSocket } from "@/hooks/useQuantumSocket"
import { TerminalHeader } from "@/components/quantum/terminal-header"
import { ExecutionLog } from "@/components/quantum/execution-log"
import { QubitGrid } from "@/components/quantum/qubit-grid"
import { TerminalPriceChart } from "@/components/quantum/terminal-price-chart"
import { HFTInfoBox } from "@/components/quantum/HFTInfoBox"
import { Terminal, Shield, Zap, Globe } from "lucide-react"

// Ensure the function name is distinct and exported as default
export default function QuantumHFTPage() {
  const liveData = useQuantumSocket()

  return (
    <div className="min-h-screen bg-[#050508] text-foreground font-mono selection:bg-primary/30">
      {/* Top Navigation / Status Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-1.5 bg-primary/10 rounded-md border border-primary/20">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-widest text-white">QUANTUM_CORE_V3</span>
            <span className="text-[9px] text-primary/60 font-bold uppercase tracking-tighter">
              Status: {liveData ? "Data Stream Active" : "Initializing QAOA Solver..."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Globe className="w-3 h-3 text-primary/50" />
            <span className="text-[9px] text-white/50 font-bold">NSE_MARKET_FEED</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <div className={`w-1.5 h-1.5 rounded-full ${liveData ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-[10px] text-white/70 font-bold">
              {liveData ? "ENGINE_LINK_STABLE" : "LINK_LOST_RETRYING"}
            </span>
          </div>
        </div>
      </div>

      <TerminalHeader liveData={liveData} />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] overflow-hidden">
        
        {/* Left Side */}
        <div className="lg:w-2/3 border-r border-white/5 flex flex-col">
          <div className="h-3/5 border-b border-white/5 relative">
            <ExecutionLog liveData={liveData} />
            {!liveData && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <Zap className="w-6 h-6 text-primary animate-bounce" />
                  <span className="text-[10px] text-primary font-bold tracking-[0.3em] uppercase">Connecting to Python Engine...</span>
                </div>
              </div>
            )}
          </div>

          <div className="h-2/5 bg-black/20">
            <TerminalPriceChart liveData={liveData} />
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:w-1/3 flex flex-col bg-black/40 overflow-y-auto">
          <QubitGrid />
          <HFTInfoBox />

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary/50">
              <Shield className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">System Integrity</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-white/5 border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] opacity-40 uppercase">Coherence</span>
                <span className="text-xs text-white">99.98%</span>
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] opacity-40 uppercase">Error Rate</span>
                <span className="text-xs text-white">0.0001%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto p-6 border-t border-white/5 bg-black/60">
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[10px] uppercase tracking-widest text-white/30">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Algo:</span> <span className="text-primary font-bold">QAOA</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Core:</span> <span className="text-primary font-bold">Qiskit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}