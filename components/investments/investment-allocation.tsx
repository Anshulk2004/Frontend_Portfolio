"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { MUTUAL_FUNDS, COMMODITIES, USD_TO_INR } from "@/constants/market-data"

export function InvestmentAllocation() {
  const [data, setData] = useState([
    { name: "Stocks", value: 466875, color: "#4F46E5" },
    { name: "Mutual Funds", value: 0, color: "#10b981" },
    { name: "Commodities", value: 0, color: "#f59e0b" },
  ]);

  const refresh = () => {
    const p = JSON.parse(localStorage.getItem("my_portfolio") || "[]");
    let mf = 0, cmd = 0;
    p.forEach((item: any) => {
      const live = item.type === "MF" ? MUTUAL_FUNDS.find(f => f.id === item.id) : COMMODITIES.find(c => c.id === item.id);
      if (live) {
        const price = "nav" in live ? live.nav : live.priceUSD * USD_TO_INR;
        if (item.type === "MF") mf += item.units * price; else cmd += item.units * price;
      }
    });
    setData(prev => [prev[0], { ...prev[1], value: mf }, { ...prev[2], value: cmd }]);
  };

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  return (
    <Card className="shadow-none border-border/60">
      <CardHeader className="py-3 border-b bg-muted/5"><CardTitle className="text-[11px] font-bold uppercase tracking-wider">Portfolio Allocation</CardTitle></CardHeader>
      <CardContent className="h-[280px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
              {data.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip formatter={(v: any) => `₹${v.toLocaleString()}`} contentStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
            <Legend wrapperStyle={{ fontSize: '11px', fontWeight: '600' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}