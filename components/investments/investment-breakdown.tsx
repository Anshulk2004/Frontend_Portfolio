"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Landmark, Coins, Trash2, ExternalLink, TrendingUp, History, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { MUTUAL_FUNDS, COMMODITIES, USD_TO_INR } from "@/constants/market-data"

export function InvestmentBreakdown() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [acquiredPrice, setAcquiredPrice] = useState("");

  useEffect(() => {
    const savedP = localStorage.getItem("my_portfolio");
    const savedH = localStorage.getItem("transaction_history");
    if (savedP) setPortfolio(JSON.parse(savedP));
    if (savedH) setHistory(JSON.parse(savedH));
  }, []);

  const selectedAssetData = [...MUTUAL_FUNDS, ...COMMODITIES].find(a => a.id === selectedAssetId);

  // Robust Price Helper to fix TS Error
  const getPrice = (asset: any) => {
    if (!asset) return 0;
    if ("nav" in asset) return asset.nav;
    if ("priceUSD" in asset) return asset.priceUSD * USD_TO_INR;
    return 0;
  };

  const handleTransaction = (type: "Buy" | "Sell") => {
    if (!selectedAssetId || !quantity || !acquiredPrice) return;
    const qty = parseFloat(quantity);
    const price = parseFloat(acquiredPrice);
    const asset = selectedAssetData!;

    let updatedPortfolio = [...portfolio];
    const existingIdx = updatedPortfolio.findIndex(item => item.id === selectedAssetId);

    if (existingIdx > -1) {
      if (type === "Buy") {
        updatedPortfolio[existingIdx].units += qty;
        updatedPortfolio[existingIdx].invested += (qty * price);
      } else {
        updatedPortfolio[existingIdx].units = Math.max(0, updatedPortfolio[existingIdx].units - qty);
        updatedPortfolio[existingIdx].invested = Math.max(0, updatedPortfolio[existingIdx].invested - (qty * price));
      }
    } else if (type === "Buy") {
      updatedPortfolio.push({
        id: selectedAssetId,
        name: asset.name,
        type: COMMODITIES.some(c => c.id === selectedAssetId) ? "COMMODITY" : "MF",
        units: qty,
        invested: qty * price
      });
    }

    const newHistory = [{
      id: Date.now(),
      assetName: asset.name,
      type,
      qty,
      price,
      total: qty * price,
      date: new Date().toLocaleDateString()
    }, ...history];

    setPortfolio(updatedPortfolio);
    setHistory(newHistory);
    localStorage.setItem("my_portfolio", JSON.stringify(updatedPortfolio));
    localStorage.setItem("transaction_history", JSON.stringify(newHistory));
    
    setIsDialogOpen(false);
    setSelectedAssetId(""); setQuantity(""); setAcquiredPrice("");
    window.dispatchEvent(new Event("storage")); // Sync Stats component
  };

  const downloadCSV = () => {
    const csv = "Date,Asset,Type,Qty,Price,Total\n" + history.map(t => `${t.date},${t.assetName},${t.type},${t.qty},${t.price},${t.total}`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'portfolio_history.csv'; a.click();
  };

  const getDisplayItems = (type: "MF" | "COMMODITY") => {
    return portfolio.filter(p => p.type === type).map(item => {
      const live = type === "MF" ? MUTUAL_FUNDS.find(f => f.id === item.id) : COMMODITIES.find(c => c.id === item.id);
      const curPrice = getPrice(live);
      return { ...item, currentValue: item.units * curPrice, netProfit: (item.units * curPrice) - item.invested };
    });
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold tracking-tight">Portfolio Assets</h2>
        <div className="flex gap-2">
          {/* History Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8"><History className="w-3.5 h-3.5 mr-2" /> History</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader className="flex flex-row items-center justify-between pr-6">
                <DialogTitle>Transaction History</DialogTitle>
                <Button variant="ghost" size="sm" onClick={downloadCSV}><Download className="w-4 h-4 mr-2" /> Export</Button>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="py-2 text-xs">{tx.date}</TableCell>
                        <TableCell className="py-2 text-xs font-semibold">{tx.assetName}</TableCell>
                        <TableCell className="py-2 text-xs uppercase">{tx.type}</TableCell>
                        <TableCell className="py-2 text-xs text-right font-mono">₹{tx.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>

          {/* Transaction Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 bg-primary"><Plus className="w-3.5 h-3.5 mr-2" /> New Entry</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
              <div className="space-y-3 py-2">
                <Select onValueChange={setSelectedAssetId}>
                  <SelectTrigger><SelectValue placeholder="Select Asset" /></SelectTrigger>
                  <SelectContent>
                    {MUTUAL_FUNDS.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    {COMMODITIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {selectedAssetData && (
                  <div className="p-2 rounded border bg-muted/50 flex justify-between text-xs">
                    <span className="font-medium text-muted-foreground">Live: ₹{getPrice(selectedAssetData).toLocaleString()}</span>
                    <span className={selectedAssetData.change >= 0 ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>{selectedAssetData.change}%</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-muted-foreground">Volume</label><Input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} /></div>
                  <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-muted-foreground">Price</label><Input type="number" value={acquiredPrice} onChange={e => setAcquiredPrice(e.target.value)} /></div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => handleTransaction("Sell")} className="flex-1">Sell</Button>
                <Button onClick={() => handleTransaction("Buy")} className="flex-1">Buy</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <AssetCard title="Mutual Funds" icon={Landmark} items={getDisplayItems("MF")} color="text-emerald-500" />
      <AssetCard title="Commodities" icon={Coins} items={getDisplayItems("COMMODITY")} color="text-amber-500" />

      <Card className="bg-muted/10 border-dashed transition-colors hover:bg-muted/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold">Stock Portfolio Dashboard</span>
          </div>
          <Button asChild variant="ghost" size="sm" className="h-8">
            <Link href="/dashboard" className="text-xs">Go to Stocks <ExternalLink className="w-3 h-3 ml-2" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function AssetCard({ title, icon: Icon, items, color }: any) {
  return (
    <Card className="shadow-none border-border/60">
      <CardHeader className="py-2.5 border-b bg-muted/5">
        <CardTitle className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${color}`} /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? <p className="p-4 text-xs text-muted-foreground text-center">No assets held</p> : 
          items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/5">
              <div className="flex-1"><p className="font-bold text-sm leading-tight">{item.name}</p><p className="text-[10px] text-muted-foreground font-medium uppercase">{item.units.toFixed(2)} Units</p></div>
              <div className="flex-1 text-right md:text-center"><p className="text-[9px] font-bold text-muted-foreground uppercase">Value</p><p className="text-sm font-bold text-primary">₹{item.currentValue.toLocaleString('en-IN')}</p></div>
              <div className="flex-1 text-right"><p className="text-[9px] font-bold text-muted-foreground uppercase">Net P/L</p><p className={`text-sm font-bold ${item.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>₹{item.netProfit.toLocaleString('en-IN')}</p></div>
            </div>
          ))
        }
      </CardContent>
    </Card>
  )
}