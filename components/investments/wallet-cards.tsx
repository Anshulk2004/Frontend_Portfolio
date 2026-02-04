"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Plus, CreditCard, ArrowUpRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function WalletCards() {
  const [addWalletOpen, setAddWalletOpen] = useState(false)
  
  const wallet = {
    name: "Main Trading Account",
    bank: "HDFC Bank",
    balance: 3768750,
    accountNumber: "**** 4521",
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Uniform Wallet Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                {wallet.accountNumber}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Balance</p>
              <p className="text-2xl font-bold text-foreground">
                Rs. {wallet.balance.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="mt-6 flex justify-between items-center border-t border-border pt-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{wallet.name}</span>
                <span className="text-xs text-muted-foreground">{wallet.bank}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-success">
                <ArrowUpRight className="w-3 h-3" />
                Linked
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uniform Add Button */}
        <Card 
          className="border-2 border-dashed border-border bg-transparent hover:bg-muted/50 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[180px]"
          onClick={() => setAddWalletOpen(true)}
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">Connect Wallet</p>
          <p className="text-xs text-muted-foreground">Add bank or demat account</p>
        </Card>
      </div>

      <Dialog open={addWalletOpen} onOpenChange={setAddWalletOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect New Wallet</DialogTitle>
            <DialogDescription>Enter your account details to sync your balance.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="wname">Account Name</Label>
              <Input id="wname" placeholder="e.g. My Savings" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bankname">Bank Name</Label>
              <Input id="bankname" placeholder="HDFC, ICICI, etc." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddWalletOpen(false)}>Cancel</Button>
            <Button onClick={() => setAddWalletOpen(false)}>Add Wallet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}