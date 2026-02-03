"use client"
import { useState, useEffect } from "react"

export function ExecutionLog({ liveData }: { liveData: any }) {
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    if (liveData) {
      setLogs(prev => [liveData, ...prev].slice(0, 20))
    }
  }, [liveData])

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      <div className="py-2 px-3 border-b font-mono text-xs opacity-50">LIVE_EXECUTION_LOG</div>
      <div className="flex-1 overflow-y-auto font-mono text-xs p-3 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2">
            <span className="opacity-50">{log.timestamp}</span>
            <span className="font-bold w-24">{log.ticker}</span>
            <span className={log.signal === "BUY" ? "text-green-500" : "text-red-500"}>{log.signal}</span>
            <span className="opacity-50">LATENCY: {log.latency_us}µs</span>
          </div>
        ))}
      </div>
    </div>
  )
}