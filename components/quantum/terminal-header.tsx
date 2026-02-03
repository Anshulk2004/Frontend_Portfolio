"use client"
export function TerminalHeader({ liveData }: { liveData: any }) {
  return (
    <div className="flex items-center gap-6 py-3 px-4 border-b font-mono text-sm bg-background">
      <div className="flex gap-2">
        <span className="opacity-50">[Ticker:</span>
        <span className="text-primary">{liveData?.ticker || "---"}</span>
        <span className="opacity-50">]</span>
      </div>
      <div className="flex gap-2">
        <span className="opacity-50">[Price:</span>
        <span className="text-primary">₹{liveData?.price || "0.00"}</span>
        <span className="opacity-50">]</span>
      </div>
      <div className="flex gap-2">
        <span className="opacity-50">[PnL:</span>
        <span className={liveData?.pnl?.includes('-') ? "text-red-500" : "text-green-500"}>
          {liveData?.pnl || "0.0%"}
        </span>
        <span className="opacity-50">]</span>
      </div>
    </div>
  )
}