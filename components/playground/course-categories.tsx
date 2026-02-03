"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  TrendingUp,
  PiggyBank,
  BarChart3,
  Shield,
  Star,
  Clock,
  Users,
  Check,
} from "lucide-react"
import { useCourses, type Course } from "./courses-context"

interface CategoryCourse extends Course {
  category: string
}

const categories = [
  {
    name: "Stock Trading",
    courses: 2,
    icon: TrendingUp,
    color: "#4F46E5",
  },
  {
    name: "Portfolio Management",
    courses: 2,
    icon: PiggyBank,
    color: "#10b981",
  },
  {
    name: "Technical Analysis",
    courses: 1,
    icon: BarChart3,
    color: "#f59e0b",
  },
  {
    name: "Risk Management",
    courses: 1,
    icon: Shield,
    color: "#ef4444",
  },
]

const categoryCourses: CategoryCourse[] = [
  // Stock Trading
  {
    category: "Stock Trading",
    title: "Stock Market Basics for Beginners",
    instructor: "Rahul Sharma",
    rating: 4.8,
    students: 9500,
    duration: "14h 30m",
    price: "Rs. 2,999",
    originalPrice: "Rs. 5,999",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
    badge: "Bestseller",
    badgeColor: "warning",
  },
  {
    category: "Stock Trading",
    title: "Advanced Stock Trading Strategies",
    instructor: "Vikram Mehta",
    rating: 4.7,
    students: 6200,
    duration: "18h 00m",
    price: "Rs. 4,499",
    originalPrice: "Rs. 8,999",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=250&fit=crop",
    badge: "Advanced",
    badgeColor: "secondary",
  },
  // Portfolio Management
  {
    category: "Portfolio Management",
    title: "Building Your First Portfolio",
    instructor: "Priya Patel",
    rating: 4.9,
    students: 7800,
    duration: "12h 15m",
    price: "Rs. 3,499",
    originalPrice: "Rs. 6,999",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    badge: "Popular",
    badgeColor: "default",
  },
  {
    category: "Portfolio Management",
    title: "Diversification Strategies",
    instructor: "Ankit Verma",
    rating: 4.6,
    students: 4500,
    duration: "10h 45m",
    price: "Rs. 2,999",
    originalPrice: "Rs. 5,999",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    badge: "New",
    badgeColor: "default",
  },
  // Technical Analysis
  {
    category: "Technical Analysis",
    title: "Chart Patterns Masterclass",
    instructor: "Saurabh Jain",
    rating: 4.8,
    students: 5600,
    duration: "16h 00m",
    price: "Rs. 3,999",
    originalPrice: "Rs. 7,999",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=250&fit=crop",
    badge: "Bestseller",
    badgeColor: "warning",
  },
  // Risk Management
  {
    category: "Risk Management",
    title: "Risk Assessment Fundamentals",
    instructor: "Neha Gupta",
    rating: 4.7,
    students: 3200,
    duration: "8h 30m",
    price: "Rs. 2,499",
    originalPrice: "Rs. 4,999",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=250&fit=crop",
    badge: "Essential",
    badgeColor: "secondary",
  },
]

export function CourseCategories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { enrollCourse, isEnrolled } = useCourses()

  const filteredCourses = selectedCategory
    ? categoryCourses.filter(c => c.category === selectedCategory)
    : []

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Browse Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card
            key={category.name}
            className="bg-card border-border hover:border-accent/50 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => setSelectedCategory(category.name)}
          >
            <CardContent className="p-4 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <category.icon className="w-6 h-6" style={{ color: category.color }} />
              </div>
              <p className="font-medium text-foreground text-sm leading-tight mb-1">
                {category.name}
              </p>
              <p className="text-xs text-muted-foreground">{category.courses} courses</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Courses Dialog */}
      <Dialog open={selectedCategory !== null} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCategory} Courses</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {filteredCourses.map((course, index) => {
              const enrolled = isEnrolled(course.title)
              return (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      className="absolute top-1 left-1 text-xs"
                      variant={course.badgeColor as "default" | "destructive" | "secondary"}
                    >
                      {course.badge}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="w-3 h-3 fill-warning" />
                        {course.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.students.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <span className="font-bold text-foreground text-sm">{course.price}</span>
                      <span className="text-xs text-muted-foreground line-through ml-1">
                        {course.originalPrice}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={enrolled ? "secondary" : "default"}
                      onClick={() => enrollCourse(course)}
                      disabled={enrolled}
                      className={enrolled ? "bg-success/10 text-success border-success/20" : "bg-accent text-accent-foreground"}
                    >
                      {enrolled ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Enrolled
                        </>
                      ) : (
                        "Enroll"
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
