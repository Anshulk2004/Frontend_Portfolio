export function HFTInfoBox() {
  return (
    <div className="p-6 m-4 rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-md">
      <h3 className="text-primary text-[10px] font-black mb-4 uppercase tracking-[0.2em]">Quantum Strategy</h3>
      <div className="space-y-4 text-[11px] leading-relaxed text-white/70">
        <p>
          The <span className="text-white font-bold">QAOA (Quantum Approximate Optimization Algorithm)</span> finds the optimal asset basket by mapping the covariance matrix to a quantum Hamiltonian.
        </p>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-start gap-3 p-2 rounded bg-black/40 border border-white/5">
            <span className="text-primary font-bold">01</span>
            <span>Entanglement maps correlation between 6 Nifty assets instantly.</span>
          </div>
          <div className="flex items-start gap-3 p-2 rounded bg-black/40 border border-white/5">
            <span className="text-primary font-bold">02</span>
            <span>Cost function minimizes Portfolio Volatility (Risk).</span>
          </div>
        </div>
      </div>
    </div>
  )
}