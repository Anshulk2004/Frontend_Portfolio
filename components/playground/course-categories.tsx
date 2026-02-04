"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  TrendingUp,
  PiggyBank,
  BarChart3,
  Shield,
  Plus,
  Star,
  Clock,
  Users,
  Check,
  Play
} from "lucide-react"
import { useCourses, type Course } from "./courses-context"

const categories = [
  { name: "Stock Trading", icon: TrendingUp, color: "#4F46E5", count: 2 },
  { name: "Portfolio Management", icon: PiggyBank, color: "#10b981", count: 2 },
  { name: "Technical Analysis", icon: BarChart3, color: "#f59e0b", count: 1 },
  { name: "Risk Management", icon: Shield, color: "#ef4444", count: 1 },
]

export function CourseCategories() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { addCourseToDB, enrollCourse, isEnrolled, playCourse } = useCourses()
  
  // State for the "Add Course" form (Matches your Backend structure)
  const [newCourse, setNewCourse] = useState({
    title: "",
    instructor: "",
    description: "",
    duration: "",
    price: "",
    category: "Stock Trading",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop"
  })

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault()
    addCourseToDB(newCourse)
    setIsAddModalOpen(false)
    // Reset form
    setNewCourse({ ...newCourse, title: "", instructor: "", description: "", duration: "", price: "" })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Browse Categories</h2>
        
        {/* ADD COURSE BUTTON (Backend Integration) */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">
              <Plus className="w-4 h-4 mr-1" /> Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Course to Database</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCourse} className="grid gap-4 py-4">
              <Input 
                placeholder="Course Title" 
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                required 
              />
              <Input 
                placeholder="Instructor Name" 
                value={newCourse.instructor}
                onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                required 
              />
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  placeholder="Duration (e.g. 12h)" 
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                />
                <Input 
                  placeholder="Price (e.g. Rs. 2999)" 
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                />
              </div>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newCourse.category}
                onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
              >
                {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
              </select>
              <Textarea 
                placeholder="Course Description" 
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              />
              <Button type="submit" className="bg-accent text-white">Save Course</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* CATEGORY GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card
            key={category.name}
            className="bg-card border-border hover:border-accent/50 transition-all cursor-pointer group"
          >
            <CardContent className="p-4 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <category.icon className="w-6 h-6" style={{ color: category.color }} />
              </div>
              <p className="font-medium text-foreground text-sm leading-tight mb-1">
                {category.name}
              </p>
              <p className="text-xs text-muted-foreground">{category.count} courses</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}