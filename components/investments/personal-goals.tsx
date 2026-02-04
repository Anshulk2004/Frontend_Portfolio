"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Target, Plus, Home, Car } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialGoals = [
  { goal_name: "Dream Home", goal_type: "Property", target_amount: 8500000, current_amount: 5525000, deadline: "Dec 2025", icon: Home },
  { goal_name: "Tesla Model 3", goal_type: "Vehicle", target_amount: 1500000, current_amount: 950000, deadline: "Jun 2025", icon: Car },
  { goal_name: "Retirement Fund", goal_type: "Financial", target_amount: 50000000, current_amount: 12500000, deadline: "Mar 2040", icon: Target }
]

export function PersonalGoals() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Card className="h-full bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Target className="w-5 h-5 text-primary" /> Financial Goals
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setIsDialogOpen(true)} className="h-8">
            <Plus className="w-4 h-4 mr-1" /> Add Goal
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {initialGoals.map((goal) => {
            const progress = (goal.current_amount / goal.target_amount) * 100
            return (
              <div key={goal.goal_name} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-bold text-foreground">{goal.goal_name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{goal.deadline}</p>
                  </div>
                  <p className="text-xs font-semibold text-primary">{progress.toFixed(0)}%</p>
                </div>
                <Progress value={progress} className="h-1.5" />
                <p className="text-[11px] text-muted-foreground">
                  Rs. {goal.current_amount.toLocaleString('en-IN')} / {goal.target_amount.toLocaleString('en-IN')}
                </p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Financial Goal</DialogTitle>
            <DialogDescription>Create a new target for your portfolio.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="gname">Goal Name</Label>
              <Input id="gname" placeholder="e.g. World Tour" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="target">Target (Rs.)</Label>
                <Input id="target" type="number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Deadline</Label>
                <Input id="date" placeholder="MMM YYYY" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsDialogOpen(false)}>Create Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}