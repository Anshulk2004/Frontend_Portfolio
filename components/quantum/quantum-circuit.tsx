"use client"

import { useEffect, useState } from "react"

const stockData = [
  { symbol: "RELIANCE", price: 2847.65 },
  { symbol: "TCS", price: 4125.30 },
  { symbol: "HDFCBANK", price: 1678.90 },
  { symbol: "INFY", price: 1892.45 },
]

export function QuantumCircuit() {
  const [activeQubit, setActiveQubit] = useState(0)
  const [pulsePhase, setPulsePhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQubit((prev) => (prev + 1) % 4)
      setPulsePhase((prev) => (prev + 1) % 360)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-[#0a0a0f] border border-[#00f3ff]/20">
      
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00f3ff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <svg className="relative w-full h-full" viewBox="0 0 800 400">
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            {/* Qubit line */}
            <line
              x1="50"
              y1={80 + i * 80}
              x2="750"
              y2={80 + i * 80}
              stroke="#00f3ff"
              strokeWidth="2"
              strokeOpacity="0.3"
            />
            
            {/* Qubit label */}
            <text
              x="20"
              y={85 + i * 80}
              fill="#00f3ff"
              fontSize="14"
              fontFamily="monospace"
            >
              |q{i}⟩
            </text>

            {/* Initial state */}
            <circle
              cx="80"
              cy={80 + i * 80}
              r="15"
              fill={activeQubit === i ? "#00f3ff" : "transparent"}
              stroke="#00f3ff"
              strokeWidth="2"
              className="transition-all duration-300"
            >
              {activeQubit === i && (
                <animate
                  attributeName="r"
                  values="15;20;15"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              )}
            </circle>

            {/* Hadamard gate */}
            <g transform={`translate(160, ${60 + i * 80})`}>
              <rect
                width="40"
                height="40"
                fill="rgba(0, 243, 255, 0.1)"
                stroke="#00f3ff"
                strokeWidth="2"
                rx="4"
              />
              <text x="20" y="26" fill="#00f3ff" fontSize="16" textAnchor="middle" fontWeight="bold">
                H
              </text>
            </g>

            {/* Stock price node */}
            <g transform={`translate(280, ${60 + i * 80})`}>
              <rect
                width="100"
                height="40"
                fill="rgba(16, 185, 129, 0.15)"
                stroke="#10b981"
                strokeWidth="2"
                rx="4"
                className={activeQubit === i ? "animate-pulse" : ""}
              />
              <text x="50" y="18" fill="#10b981" fontSize="10" textAnchor="middle" fontFamily="monospace">
                {stockData[i].symbol}
              </text>
              <text x="50" y="32" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">
                ₹{stockData[i].price.toLocaleString()}
              </text>
            </g>

            {/* Phase gate */}
            <g transform={`translate(440, ${60 + i * 80})`}>
              <rect
                width="40"
                height="40"
                fill="rgba(0, 243, 255, 0.1)"
                stroke="#00f3ff"
                strokeWidth="2"
                rx="4"
              />
              <text x="20" y="26" fill="#00f3ff" fontSize="14" textAnchor="middle" fontWeight="bold">
                Rz
              </text>
            </g>

            {/* Measurement */}
            <g transform={`translate(560, ${60 + i * 80})`}>
              <rect
                width="50"
                height="40"
                fill="rgba(0, 243, 255, 0.05)"
                stroke="#00f3ff"
                strokeWidth="2"
                rx="4"
              />
              <path
                d="M 10 30 Q 25 10 40 30"
                fill="none"
                stroke="#00f3ff"
                strokeWidth="2"
              />
              <line x1="25" y1="20" x2="35" y2="10" stroke="#00f3ff" strokeWidth="2" />
            </g>

            {/* Output probability */}
            <g transform={`translate(680, ${60 + i * 80})`}>
              <rect
                width="60"
                height="40"
                fill={i % 2 === 0 ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}
                stroke={i % 2 === 0 ? "#10b981" : "#ef4444"}
                strokeWidth="2"
                rx="4"
              />
              <text
                x="30"
                y="26"
                fill={i % 2 === 0 ? "#10b981" : "#ef4444"}
                fontSize="12"
                textAnchor="middle"
                fontWeight="bold"
              >
                {i % 2 === 0 ? "BUY" : "SELL"}
              </text>
            </g>
          </g>
        ))}

        {/* CNOT gates (entanglement connections) */}
        {[0, 1, 2].map((i) => (
          <g key={`cnot-${i}`}>
            <line
              x1="520"
              y1={80 + i * 80}
              x2="520"
              y2={160 + i * 80}
              stroke="#00f3ff"
              strokeWidth="2"
              strokeOpacity="0.5"
            />
            <circle
              cx="520"
              cy={80 + i * 80}
              r="6"
              fill="#00f3ff"
            />
            <circle
              cx="520"
              cy={160 + i * 80}
              r="10"
              fill="transparent"
              stroke="#00f3ff"
              strokeWidth="2"
            />
            <line
              x1="510"
              y1={160 + i * 80}
              x2="530"
              y2={160 + i * 80}
              stroke="#00f3ff"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Animated data flow particles */}
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={`particle-${i}`}
            r="4"
            fill="#00f3ff"
            className="animate-pulse"
          >
            <animateMotion
              dur={`${2 + i * 0.3}s`}
              repeatCount="indefinite"
              path={`M 80 ${80 + i * 80} L 740 ${80 + i * 80}`}
            />
          </circle>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#00f3ff]" />
          <span className="text-[#00f3ff]">Quantum Gates</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#10b981]" />
          <span className="text-[#10b981]">Stock Data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#ef4444]" />
          <span className="text-[#ef4444]">Trade Signals</span>
        </div>
      </div>
    </div>
  )
}
