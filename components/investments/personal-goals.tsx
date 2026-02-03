"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Target, Plus, Home, Car, GraduationCap, Plane, Briefcase, Heart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Goal {
  name: string
  icon: typeof Home
  target: number
  current: number
  deadline: string
  color: string
}

const initialGoals: Goal[] = [
  {
    name: "Dream Home",
    icon: Home,
    target: 8500000,
    current: 5525000,
    deadline: "Dec 2025",
    color: "#4F46E5",
  },
  {
    name: "New Car",
    icon: Car,
    target: 1500000,
    current: 950000,
    deadline: "Jun 2025",
    color: "#10b981",
  },
  {
    name: "Kids Education",
    icon: GraduationCap,
    target: 3500000,
    current: 1820000,
    deadline: "Sep 2028",
    color: "#f59e0b",
  },
  {
    name: "World Trip",
    icon: Plane,
    target: 800000,
    current: 600000,
    deadline: "Mar 2025",
    color: "#8b5cf6",
  },
]

const goalCategories = [
  { value: "home", label: "Home/Property", icon: Home },
  { value: "car", label: "Vehicle", icon: Car },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "travel", label: "Travel", icon: Plane },
  { value: "retirement", label: "Retirement", icon: Briefcase },
  { value: "health", label: "Healthcare", icon: Heart },
]

export function PersonalGoals() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [addGoalOpen, setAddGoalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: "",
    category: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    monthlyContribution: "",
  })

  const formatINR = (value: number) => {
    if (value >= 10000000) {
      return `Rs. ${(value / 10000000).toFixed(2)} Cr`
    } else if (value >= 100000) {
      return `Rs. ${(value / 100000).toFixed(2)} L`
    }
    return `Rs. ${value.toLocaleString('en-IN')}`
  }

  const colors = ["#4F46E5", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"]

  const getIconForCategory = (category: string) => {
    const cat = goalCategories.find(c => c.value === category)
    return cat?.icon || Target
  }

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.deadline) {
      const Icon = getIconForCategory(newGoal.category)
      const newGoalData: Goal = {
        name: newGoal.name,
        icon: Icon,
        target: parseFloat(newGoal.targetAmount),
        current: parseFloat(newGoal.currentAmount) || 0,
        deadline: newGoal.deadline,
        color: colors[goals.length % colors.length],
      }
      setGoals([...goals, newGoalData])
      setNewGoal({
        name: "",
        category: "",
        targetAmount: "",
        currentAmount: "",
        deadline: "",
        monthlyContribution: "",
      })
      setAddGoalOpen(false)
    }
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            <CardTitle className="text-lg font-semibold text-foreground">Personal Goals</CardTitle>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setAddGoalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100
              return (
                <div key={goal.name} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${goal.color}20` }}
                      >
                        <goal.icon className="w-5 h-5" style={{ color: goal.color }} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{goal.name}</p>
                        <p className="text-sm text-muted-foreground">Target: {goal.deadline}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{progress.toFixed(0)}%</p>
                      <p className="text-sm text-muted-foreground">completed</p>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatINR(goal.current)} saved
                    </span>
                    <span className="text-foreground font-medium">
                      {formatINR(goal.target)} goal
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Goal Dialog */}
      <Dialog open={addGoalOpen} onOpenChange={setAddGoalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>
              Set a financial goal to track your progress towards achieving it
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                placeholder="e.g., Dream Home, New Car"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newGoal.category} 
                onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {goalCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount (Rs.)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="e.g., 5000000"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentAmount">Current Savings (Rs.)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  placeholder="e.g., 1000000"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Target Date</Label>
                <Input
                  id="deadline"
                  placeholder="e.g., Dec 2025"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">Monthly Contribution (Rs.)</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  placeholder="e.g., 25000"
                  value={newGoal.monthlyContribution}
                  onChange={(e) => setNewGoal({ ...newGoal, monthlyContribution: e.target.value })}
                />
              </div>
            </div>
            {newGoal.targetAmount && newGoal.currentAmount && (
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Remaining to save</p>
                <p className="text-lg font-bold">{formatINR(parseFloat(newGoal.targetAmount) - parseFloat(newGoal.currentAmount))}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddGoalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddGoal}
              disabled={!newGoal.name || !newGoal.targetAmount || !newGoal.deadline}
              className="bg-accent text-accent-foreground"
            >
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
