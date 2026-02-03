"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface Course {
  title: string
  instructor: string
  rating: number
  students: number
  duration: string
  price: string
  originalPrice: string
  image: string
  badge: string
  badgeColor: string
  progress?: number
  totalLessons?: number
  completedLessons?: number
  nextLesson?: string
}

interface CoursesContextType {
  enrolledCourses: Course[]
  enrollCourse: (course: Course) => void
  isEnrolled: (title: string) => boolean
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined)

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([
    {
      title: "Technical Analysis Masterclass",
      instructor: "Rajesh Sharma",
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      nextLesson: "Understanding Candlestick Patterns",
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
      rating: 4.8,
      students: 8500,
      price: "Rs. 4,999",
      originalPrice: "Rs. 9,999",
      badge: "Bestseller",
      badgeColor: "warning",
    },
    {
      title: "Portfolio Management Fundamentals",
      instructor: "Priya Patel",
      progress: 40,
      totalLessons: 18,
      completedLessons: 7,
      nextLesson: "Risk Assessment Strategies",
      duration: "30 min",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
      rating: 4.7,
      students: 6200,
      price: "Rs. 3,499",
      originalPrice: "Rs. 6,999",
      badge: "Popular",
      badgeColor: "default",
    },
    {
      title: "Options Trading for Beginners",
      instructor: "Vikram Mehta",
      progress: 25,
      totalLessons: 20,
      completedLessons: 5,
      nextLesson: "Call and Put Options Explained",
      duration: "35 min",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300&h=200&fit=crop",
      rating: 4.9,
      students: 4500,
      price: "Rs. 5,999",
      originalPrice: "Rs. 11,999",
      badge: "Advanced",
      badgeColor: "secondary",
    },
  ])

  const enrollCourse = (course: Course) => {
    if (!isEnrolled(course.title)) {
      const enrolledCourse: Course = {
        ...course,
        progress: 0,
        totalLessons: 20,
        completedLessons: 0,
        nextLesson: "Introduction to the Course",
      }
      setEnrolledCourses([enrolledCourse, ...enrolledCourses])
    }
  }

  const isEnrolled = (title: string) => {
    return enrolledCourses.some(c => c.title === title)
  }

  return (
    <CoursesContext.Provider value={{ enrolledCourses, enrollCourse, isEnrolled }}>
      {children}
    </CoursesContext.Provider>
  )
}

export function useCourses() {
  const context = useContext(CoursesContext)
  if (context === undefined) {
    throw new Error("useCourses must be used within a CoursesProvider")
  }
  return context
}
