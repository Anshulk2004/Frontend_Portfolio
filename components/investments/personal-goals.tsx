"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Target, Plus, Loader2, Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FinancialGoal {
  id: number
  user?: {
    id: number
  }
  goalName: string
  goalType: string
  targetAmount: number
  currentAmount: number
  deadline: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: number
  name: string
  email: string
}

export function PersonalGoals() {
  const { toast } = useToast()
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null)
  const [formData, setFormData] = useState({
    goalName: "",
    goalType: "Savings",
    targetAmount: "",
    currentAmount: "",
    deadline: ""
  })

  useEffect(() => {
    fetchUser()
    fetchGoals()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user")
      setUser(response.data)
    } catch (error) {
      console.error("Failed to fetch user:", error)
    }
  }

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:8080/api/financial-goals")
      setGoals(response.data)
    } catch (error) {
      console.error("Failed to fetch financial goals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGoal = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User information not loaded. Please try again.",
        variant: "destructive",
      })
      return
    }

    try {
      await axios.post("http://localhost:8080/api/financial-goals", {
        user: { id: user.id },
        goalName: formData.goalName,
        goalType: formData.goalType,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        deadline: formData.deadline
      })
      
      toast({
        title: "Success",
        description: "Financial goal created successfully",
      })
      
      setAddDialogOpen(false)
      setFormData({ goalName: "", goalType: "Savings", targetAmount: "", currentAmount: "", deadline: "" })
      fetchGoals()
    } catch (error) {
      console.error("Failed to add goal:", error)
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditGoal = async () => {
    if (!selectedGoal) return

    try {
      await axios.put(`http://localhost:8080/api/financial-goals/${selectedGoal.id}`, {
        ...selectedGoal,
        goalName: formData.goalName,
        goalType: formData.goalType,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        deadline: formData.deadline
      })
      
      toast({
        title: "Success",
        description: "Goal updated successfully",
      })
      
      setEditDialogOpen(false)
      fetchGoals()
    } catch (error) {
      console.error("Failed to update goal:", error)
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGoal = async () => {
    if (!selectedGoal) return

    try {
      await axios.delete(`http://localhost:8080/api/financial-goals/${selectedGoal.id}`)
      
      toast({
        title: "Success",
        description: "Goal deleted successfully",
      })
      
      setDeleteDialogOpen(false)
      fetchGoals()
    } catch (error) {
      console.error("Failed to delete goal:", error)
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (goal: FinancialGoal) => {
    setSelectedGoal(goal)
    setFormData({
      goalName: goal.goalName,
      goalType: goal.goalType,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline
    })
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (goal: FinancialGoal) => {
    setSelectedGoal(goal)
    setDeleteDialogOpen(true)
  }

  const formatDeadline = (deadline: string) => {
    try {
      const date = new Date(deadline)
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } catch {
      return deadline
    }
  }

  if (loading) {
    return (
      <Card className="h-full bg-card border-border">
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="h-full bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Target className="w-5 h-5 text-primary" /> Financial Goals
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              setFormData({ goalName: "", goalType: "Savings", targetAmount: "", currentAmount: "", deadline: "" })
              setAddDialogOpen(true)
            }} 
            className="h-8"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Goal
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No financial goals yet</p>
              <p className="text-xs">Create your first goal to get started</p>
            </div>
          ) : (
            goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              return (
                <div key={goal.id} className="space-y-2 relative group">
                  <div className="flex justify-between items-end">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-foreground">{goal.goalName}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">
                            {formatDeadline(goal.deadline)} • {goal.goalType}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-primary">{progress.toFixed(0)}%</p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(goal)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => openDeleteDialog(goal)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                  <p className="text-[11px] text-muted-foreground">
                    Rs. {goal.currentAmount.toLocaleString('en-IN')} / Rs. {goal.targetAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Add Goal Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Financial Goal</DialogTitle>
            <DialogDescription>Create a new target for your portfolio.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="goalName">Goal Name</Label>
              <Input 
                id="goalName" 
                placeholder="e.g. Dream Home, Retirement" 
                value={formData.goalName}
                onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goalType">Goal Type</Label>
              <Select value={formData.goalType} onValueChange={(value) => setFormData({ ...formData, goalType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Property">Property</SelectItem>
                  <SelectItem value="Vehicle">Vehicle</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Retirement">Retirement</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="targetAmount">Target Amount (Rs.)</Label>
                <Input 
                  id="targetAmount" 
                  type="number" 
                  placeholder="1000000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currentAmount">Current Amount (Rs.)</Label>
                <Input 
                  id="currentAmount" 
                  type="number" 
                  placeholder="0"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input 
                id="deadline" 
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddGoal}>Create Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Financial Goal</DialogTitle>
            <DialogDescription>Update your financial goal details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editGoalName">Goal Name</Label>
              <Input 
                id="editGoalName" 
                value={formData.goalName}
                onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editGoalType">Goal Type</Label>
              <Select value={formData.goalType} onValueChange={(value) => setFormData({ ...formData, goalType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Property">Property</SelectItem>
                  <SelectItem value="Vehicle">Vehicle</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Retirement">Retirement</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editTargetAmount">Target Amount (Rs.)</Label>
                <Input 
                  id="editTargetAmount" 
                  type="number" 
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editCurrentAmount">Current Amount (Rs.)</Label>
                <Input 
                  id="editCurrentAmount" 
                  type="number" 
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editDeadline">Deadline</Label>
              <Input 
                id="editDeadline" 
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditGoal}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Financial Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedGoal?.goalName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteGoal}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}