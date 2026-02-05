"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"

export interface Course {
  id: number
  title: string
  instructor: string
  description?: string
  category?: string
  duration: string
  price: number
  rating?: number
  studentsCount?: number
  imageUrl?: string
  createdAt?: string
}

export interface UserCourse {
  id: number
  user?: { id: number }
  course: Course
  progress: number
  completedLessons: number
  totalLessons: number
  enrolledAt: string
  lastAccessed: string
}

interface User {
  id: number
  name: string
  email: string
}

interface CoursesContextType {
  courses: Course[]
  userCourses: UserCourse[]
  user: User | null
  loading: boolean
  fetchCourses: (category?: string) => void
  fetchUserCourses: () => void
  enrollCourse: (course: Course) => void
  addCourseToDB: (course: Partial<Course>) => void
  updateProgress: (userCourseId: number, progress: number, completedLessons: number) => void
  isEnrolled: (courseId: number) => boolean
  playCourse: () => void
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined)

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([])
  const [userCourses, setUserCourses] = useState<UserCourse[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch user on mount
  useEffect(() => {
    fetchUser()
  }, [])

  // Fetch user courses when user is available
  useEffect(() => {
    if (user) {
      fetchUserCourses()
    }
  }, [user])

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user")
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  const fetchCourses = async (category?: string) => {
    setLoading(true)
    try {
      const params = category ? { category } : {}
      const response = await axios.get("http://localhost:8080/api/courses", { params })
      setCourses(response.data)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserCourses = async () => {
    if (!user) return
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:8080/api/user-courses", {
        params: { userId: user.id }
      })
      setUserCourses(response.data)
    } catch (error) {
      console.error("Error fetching user courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const enrollCourse = async (course: Course) => {
    if (!user) return
    if (isEnrolled(course.id)) {
      console.log("Already enrolled in this course")
      return
    }

    try {
      const response = await axios.post("http://localhost:8080/api/user-courses", {
        user: { id: user.id },
        course: { id: course.id },
        progress: 0,
        completedLessons: 0,
        totalLessons: 10,
        enrolledAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      })
      setUserCourses([response.data, ...userCourses])
    } catch (error: any) {
      if (error.response?.status === 409 || error.response?.data?.message?.includes("Duplicate")) {
        console.log("Already enrolled in this course")
        fetchUserCourses()
      } else {
        console.error("Error enrolling in course:", error)
      }
    }
  }

  const addCourseToDB = async (courseData: Partial<Course>) => {
    try {
      const response = await axios.post("http://localhost:8080/api/courses", courseData)
      setCourses([response.data, ...courses])
    } catch (error) {
      console.error("Error adding course:", error)
    }
  }

  const updateProgress = async (userCourseId: number, progress: number, completedLessons: number) => {
    try {
      const userCourse = userCourses.find(uc => uc.id === userCourseId)
      if (!userCourse) return

      await axios.put(`http://localhost:8080/api/user-courses/${userCourseId}`, {
        ...userCourse,
        progress,
        completedLessons,
        lastAccessed: new Date().toISOString()
      })
      
      setUserCourses(userCourses.map(uc => 
        uc.id === userCourseId 
          ? { ...uc, progress, completedLessons, lastAccessed: new Date().toISOString() }
          : uc
      ))
    } catch (error) {
      console.error("Error updating progress:", error)
    } finally {
      fetchUserCourses()
    }
  }

  const isEnrolled = (courseId: number) => {
    return userCourses.some(uc => uc.course.id === courseId)
  }

  const playCourse = () => {
    window.open("https://www.youtube.com/watch?v=8TJQhQ2GZ0Y", "_blank")
  }

  return (
    <CoursesContext.Provider value={{ 
      courses, 
      userCourses, 
      user,
      loading,
      fetchCourses, 
      fetchUserCourses,
      enrollCourse, 
      addCourseToDB, 
      updateProgress,
      isEnrolled, 
      playCourse 
    }}>
      {children}
    </CoursesContext.Provider>
  )
}

export const useCourses = () => {
  const context = useContext(CoursesContext)
  if (!context) throw new Error("useCourses must be used within Provider")
  return context
}