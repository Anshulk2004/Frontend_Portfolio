"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, ExternalLink, Coins, TrendingUp, Landmark, Trash2, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const AVAILABLE_ASSETS = {
  MF: [
    { id: "119598", name: "Parag Parikh Flexi Cap" },
    { id: "119063", name: "Mirae Asset Large Cap" },
    { id: "118989", name: "HDFC Mid-Cap" }
  ],
  COMMODITY: [
    { id: "GC=F", name: "Gold" },
    { id: "SI=F", name: "Silver" },
    { id: "CL=F", name: "Crude Oil" }
  ]
}

export function InvestmentBreakdown() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleAction = (type: "Buy" | "Sell") => {
    console.log(`Performing ${type} operation`);
    setIsDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Asset Management</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary">
              <Plus className="w-4 h-4 mr-2" /> Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Investment Entry</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <Select>
                <SelectTrigger><SelectValue placeholder="Select Asset" /></SelectTrigger>
                <SelectContent>
                  <SelectItem disabled value="head1" className="font-bold">Mutual Funds</SelectItem>
                  {AVAILABLE_ASSETS.MF.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                  <SelectItem disabled value="head2" className="font-bold">Commodities</SelectItem>
                  {AVAILABLE_ASSETS.COMMODITY.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Amount (INR)" />
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => handleAction("Sell")} className="flex-1 text-destructive">Sell</Button>
              <Button onClick={() => handleAction("Buy")} className="flex-1">Buy</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <AssetCategoryCard title="Mutual Funds" icon={Landmark} items={dummyMFs} color="text-emerald-500" />
      <AssetCategoryCard title="Precious Metals & Commodities" icon={Coins} items={dummyCommodities} color="text-amber-500" />
      <Card className="bg-muted/10 border-dashed">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <span className="font-medium text-sm">Equity Portfolio (Stocks)</span>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">View All <ExternalLink className="w-3 h-3 ml-2" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function AssetCategoryCard({ title, icon: Icon, items, color }: any) {
  return (
    <Card>
      <CardHeader className="py-3 border-b">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/5 transition-colors">
            <div className="flex-1">
              <p className="font-bold text-sm">{item.category}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{item.count} Units</p>
            </div>
            <div className="flex-1 text-right md:text-center">
              <p className="text-[10px] text-muted-foreground uppercase">Current Value</p>
              <p className="text-sm font-bold">Rs. {item.value.toLocaleString('en-IN')}</p>
            </div>
            <div className="hidden md:block flex-1 text-right">
              <p className="text-[10px] text-muted-foreground uppercase">Returns</p>
              <p className="text-sm text-emerald-500">+{((item.value - item.invested)/item.invested * 100).toFixed(1)}%</p>
            </div>
            <div className="flex gap-1 ml-4">
               <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const dummyMFs = [
  { category: "Parag Parikh Flexi Cap", value: 245000, invested: 180000, count: "142.2" },
  { category: "Mirae Asset Large Cap", value: 182000, invested: 150000, count: "98.5" },
]

const dummyCommodities = [
  { category: "Gold", value: 320000, invested: 240000, count: "40g" },
  { category: "Silver", value: 45000, invested: 38000, count: "1kg" },
]