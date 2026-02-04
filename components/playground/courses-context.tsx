"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Course {
  id?: string
  title: string
  instructor: string
  description?: string
  category?: string
  duration: string
  price: string
  originalPrice?: string; 
  image: string
  badge?: string;         
  badgeColor?: string;    
  rating?: number
  students?: number
  progress?: number
  completedLessons?: number
  totalLessons?: number
}

interface CoursesContextType {
  enrolledCourses: Course[]
  enrollCourse: (course: Course) => void
  addCourseToDB: (course: Partial<Course>) => void
  isEnrolled: (title: string) => boolean
  playCourse: () => void
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined)

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("enrolled_courses")
    if (saved) setEnrolledCourses(JSON.parse(saved))
  }, [])

  // Save to LocalStorage on change
  useEffect(() => {
    if (enrolledCourses.length > 0) {
      localStorage.setItem("enrolled_courses", JSON.stringify(enrolledCourses))
    }
  }, [enrolledCourses])

  const enrollCourse = (course: Course) => {
    if (!isEnrolled(course.title)) {
      const newEnrollment = {
        ...course,
        progress: 0,
        completedLessons: 0,
        totalLessons: 10,
      }
      setEnrolledCourses([newEnrollment, ...enrolledCourses])
    }
  }

  const addCourseToDB = (courseData: Partial<Course>) => {
    // This structure matches your backend: category, description, duration, instructor, price, title
    console.log("Sending to Backend:", {
      ...courseData,
      createdAt: new Date().toISOString(),
    })
    // For now, we also enroll it locally so it shows up
    enrollCourse(courseData as Course)
  }

  const isEnrolled = (title: string) => enrolledCourses.some(c => c.title === title)

  const playCourse = () => {
    window.open("https://www.youtube.com/watch?v=8TJQhQ2GZ0Y", "_blank")
  }

  return (
    <CoursesContext.Provider value={{ enrolledCourses, enrollCourse, addCourseToDB, isEnrolled, playCourse }}>
      {children}
    </CoursesContext.Provider>
  )
}

export const useCourses = () => {
  const context = useContext(CoursesContext)
  if (!context) throw new Error("useCourses must be used within Provider")
  return context
}