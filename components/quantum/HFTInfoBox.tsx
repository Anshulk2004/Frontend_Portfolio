"use client"
export function HFTInfoBox() {
  return (
    <div className="p-4 m-4 rounded-lg border border-primary/20 bg-primary/5 font-mono text-xs leading-relaxed">
      <h3 className="text-primary font-bold mb-2 uppercase">Why Nifty 50 HFT?</h3>
      <p className="mb-2">
        High-Frequency Trading (HFT) exploits micro-inefficiencies in price Discovery. 
        In the Nifty 50 index, high liquidity and heavy trading volumes create tight bid-ask spreads, making it the ideal environment for algorithms to execute thousands of orders in milliseconds.
      </p>
      <ul className="list-disc ml-4 space-y-1 opacity-80">
        <li>Co-location: Minimizes physical distance to NSE servers.</li>
        <li>Arbitrage: Captures gaps between Spot and Futures.</li>
        <li>Micro-Ticks: Profits from 0.05 paise fluctuations.</li>
      </ul>
    </div>
  )
}