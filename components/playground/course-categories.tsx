"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  TrendingUp,
  PiggyBank,
  BarChart3,
  Shield,
  Plus,
} from "lucide-react"
import { useCourses } from "./courses-context"

const categories = [
  { name: "Stock Trading", icon: TrendingUp, color: "#4F46E5" },
  { name: "Portfolio Management", icon: PiggyBank, color: "#10b981" },
  { name: "Technical Analysis", icon: BarChart3, color: "#f59e0b" },
  { name: "Risk Management", icon: Shield, color: "#ef4444" },
]

export function CourseCategories() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { addCourseToDB, fetchCourses, courses } = useCourses()
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})  
  const [newCourse, setNewCourse] = useState({
    title: "",
    instructor: "",
    description: "",
    duration: "",
    price: 0,
    category: "Stock Trading",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
    rating: 0,
    studentsCount: 0
  })

  useEffect(() => {
    const counts: Record<string, number> = {}
    categories.forEach(cat => {
      counts[cat.name] = courses.filter(c => c.category === cat.name).length
    })
    setCategoryCounts(counts)
  }, [courses])

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    await addCourseToDB(newCourse)
    setIsAddModalOpen(false)    
    setNewCourse({ 
      ...newCourse, 
      title: "", 
      instructor: "", 
      description: "", 
      duration: "", 
      price: 0,
      rating: 0,
      studentsCount: 0
    })
  }

  const handleCategoryClick = (categoryName: string) => {
    fetchCourses(categoryName)
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
                  type="number"
                  placeholder="Price (e.g. 2999)" 
                  value={newCourse.price || ""}
                  onChange={(e) => setNewCourse({...newCourse, price: Number(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  type="number"
                  step="0.1"
                  placeholder="Rating (e.g. 4.5)" 
                  value={newCourse.rating || ""}
                  onChange={(e) => setNewCourse({...newCourse, rating: Number(e.target.value)})}
                />
                <Input 
                  type="number"
                  placeholder="Students (e.g. 1000)" 
                  value={newCourse.studentsCount || ""}
                  onChange={(e) => setNewCourse({...newCourse, studentsCount: Number(e.target.value)})}
                />
              </div>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newCourse.category}
                onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
              >
                {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
              </select>
              <Input 
                placeholder="Image URL" 
                value={newCourse.imageUrl}
                onChange={(e) => setNewCourse({...newCourse, imageUrl: e.target.value})}
              />
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
            onClick={() => handleCategoryClick(category.name)}
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
              <p className="text-xs text-muted-foreground">
                {categoryCounts[category.name] || 0} courses
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}