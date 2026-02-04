"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, Clock, Users, Play, Check, Search } from "lucide-react"
import { useCourses, Course } from "./courses-context"

const featuredCourses: Course[] = [
  {
    title: "Complete Stock Market Investing",
    instructor: "Ankit Verma",
    rating: 4.9,
    students: 12500,
    duration: "18h 30m",
    price: "Rs. 4,999",
    originalPrice: "Rs. 9,999",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
    badge: "Bestseller",
    badgeColor: "warning",
  },
  {
    title: "Cryptocurrency Trading Mastery",
    instructor: "Saurabh Jain",
    rating: 4.8,
    students: 8900,
    duration: "24h 15m",
    price: "Rs. 3,999",
    originalPrice: "Rs. 7,999",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=250&fit=crop",
    badge: "Hot",
    badgeColor: "destructive",
  },
  {
    title: "Financial Planning & Budgeting",
    instructor: "Neha Gupta",
    rating: 4.7,
    students: 6200,
    duration: "12h 45m",
    price: "Rs. 2,499",
    originalPrice: "Rs. 4,999",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    badge: "New",
    badgeColor: "default",
  },
  {
    title: "Advanced Options Strategies",
    instructor: "Rahul Agarwal",
    rating: 4.9,
    students: 4500,
    duration: "20h 00m",
    price: "Rs. 6,999",
    originalPrice: "Rs. 12,999",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=250&fit=crop",
    badge: "Advanced",
    badgeColor: "secondary",
  },
]

export function FeaturedCourses() {
  const { enrollCourse, isEnrolled, playCourse } = useCourses()
  const [isBrowseAllOpen, setIsBrowseAllOpen] = useState(false)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Featured Courses</CardTitle>
        
        {/* BROWSE ALL LOGIC */}
        <Dialog open={isBrowseAllOpen} onOpenChange={setIsBrowseAllOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">
              Browse All
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Explore All Courses</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {featuredCourses.map((course, index) => (
                <CourseItem 
                  key={index} 
                  course={course} 
                  isEnrolled={isEnrolled(course.title)} 
                  onEnroll={enrollCourse} 
                  onPlay={playCourse}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredCourses.map((course, index) => (
            <CourseItem 
              key={index} 
              course={course} 
              isEnrolled={isEnrolled(course.title)} 
              onEnroll={enrollCourse} 
              onPlay={playCourse}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Sub-component for cleaner code
function CourseItem({ course, isEnrolled, onEnroll, onPlay }: { 
  course: Course, 
  isEnrolled: boolean, 
  onEnroll: (c: Course) => void,
  onPlay: () => void 
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all group bg-background">
      <div className="relative h-36 overflow-hidden">
        <img
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge
  className="absolute top-2 left-2"
  variant={(course.badgeColor as "default" | "destructive" | "secondary" | "outline") || "default"}
>
  {course.badge}
</Badge>
        <div 
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => isEnrolled && onPlay()}
        >
          <Play className="w-12 h-12 text-white fill-white" />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-foreground mb-1 line-clamp-1">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>

        <div className="flex items-center gap-3 text-sm mb-3 text-muted-foreground">
          <div className="flex items-center gap-1 text-warning">
            <Star className="w-4 h-4 fill-warning" />
            <span className="text-foreground font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
  <Users className="w-4 h-4" />
  {(course.students?.toLocaleString()) || "0"}
</div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="font-bold text-foreground">{course.price}</span>
            <span className="text-xs text-muted-foreground line-through">
              {course.originalPrice}
            </span>
          </div>
          <Button 
            size="sm" 
            variant={isEnrolled ? "secondary" : "outline"}
            onClick={() => !isEnrolled && onEnroll(course)}
            disabled={isEnrolled}
            className={isEnrolled ? "bg-success/10 text-success border-success/20" : "border-accent text-accent hover:bg-accent/10"}
          >
            {isEnrolled ? (
              <><Check className="w-4 h-4 mr-1" /> Enrolled</>
            ) : (
              "Enroll Now"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}