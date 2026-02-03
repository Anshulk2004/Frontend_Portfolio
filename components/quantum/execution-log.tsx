"use client"

import { useState, useEffect, useRef } from "react"

interface LogEntry {
  id: number
  timestamp: string
  symbol: string
  signal: "BUY" | "SELL" | "HOLD"
  confidence: number
}

const symbols = [
  "RELIANCE.NS",
  "TCS.NS",
  "HDFCBANK.NS",
  "INFY.NS",
  "ICICIBANK.NS",
  "HINDUNILVR.NS",
  "SBIN.NS",
  "BHARTIARTL.NS",
  "ITC.NS",
  "KOTAKBANK.NS",
]

function generateLogEntry(id: number): LogEntry {
  const now = new Date()
  const timestamp = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  const symbol = symbols[Math.floor(Math.random() * symbols.length)]
  const signals: ("BUY" | "SELL" | "HOLD")[] = ["BUY", "SELL", "HOLD"]
  const signal = signals[Math.floor(Math.random() * signals.length)]
  const confidence = Math.floor(70 + Math.random() * 28)

  return { id, timestamp, symbol, signal, confidence }
}

export function ExecutionLog() {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const initial: LogEntry[] = []
    for (let i = 0; i < 15; i++) {
      initial.push(generateLogEntry(i))
    }
    return initial
  })
  const [idCounter, setIdCounter] = useState(15)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLog = generateLogEntry(idCounter)
        setIdCounter((c) => c + 1)
        const updated = [newLog, ...prev]
        if (updated.length > 50) {
          return updated.slice(0, 50)
        }
        return updated
      })
    }, 800)
    return () => clearInterval(interval)
  }, [idCounter])

  return (
    <div className="flex flex-col h-full">
      <div className="py-2 px-3 border-b border-[#333] font-mono text-xs text-[#888]">
        EXECUTION_LOG
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto font-mono text-xs p-3 space-y-1">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center gap-2 py-0.5">
            <span className="text-[#888]">{log.timestamp}</span>
            <span className="text-[#888]">-</span>
            <span className="text-white w-28">{log.symbol}</span>
            <span className="text-[#888]">-</span>
            <span className="text-[#888]">SIGNAL:</span>
            <span
              className={
                log.signal === "BUY"
                  ? "text-[#10b981]"
                  : log.signal === "SELL"
                    ? "text-[#ef4444]"
                    : "text-[#888]"
              }
            >
              {log.signal}
            </span>
            <span className="text-[#888]">-</span>
            <span className="text-[#888]">CONFIDENCE:</span>
            <span className="text-white">{log.confidence}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
