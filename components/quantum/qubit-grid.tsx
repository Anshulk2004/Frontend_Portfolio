"use client"

import { useState, useEffect } from "react"

export function QubitGrid() {
  const [qubits, setQubits] = useState<number[]>(Array(16).fill(0))

  useEffect(() => {
    const interval = setInterval(() => {
      setQubits((prev) => {
        const newQubits = [...prev]
        const numChanges = Math.floor(Math.random() * 4) + 1
        for (let i = 0; i < numChanges; i++) {
          const idx = Math.floor(Math.random() * 16)
          newQubits[idx] = newQubits[idx] === 0 ? 1 : 0
        }
        return newQubits
      })
    }, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="py-2 px-3 border-b border-[#333] font-mono text-xs text-[#888]">
        QUANTUM_STATE_MONITOR
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="grid grid-cols-4 gap-2">
          {qubits.map((value, idx) => (
            <div
              key={idx}
              className="w-10 h-10 border border-[#333] flex items-center justify-center font-mono text-sm transition-colors duration-150"
              style={{
                backgroundColor: value === 1 ? "#10b981" : "#0a0a0a",
                color: value === 1 ? "#0a0a0a" : "#888",
              }}
            >
              {value}
            </div>
          ))}
        </div>
        <div className="mt-4 font-mono text-xs text-[#888]">
          Q[0:15] | Coherence: 94.2%
        </div>
      </div>
    </div>
  )
}
