"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, BookOpen, Award, Target, Flame, Trophy } from "lucide-react"
import { useCourses } from "./courses-context"

export function LearningStats() {
  const { userCourses } = useCourses()
  const [stats, setStats] = useState([
    {
      title: "Hours Learned",
      value: "0",
      subtitle: "This month: 0h",
      icon: Clock,
      color: "#4F46E5",
    },
    {
      title: "Courses Completed",
      value: "0",
      subtitle: "0 in progress",
      icon: BookOpen,
      color: "#10b981",
    },
    {
      title: "Certificates Earned",
      value: "0",
      subtitle: "0 pending",
      icon: Award,
      color: "#f59e0b",
    },
    {
      title: "Current Streak",
      value: "0 days",
      subtitle: "Best: 0 days",
      icon: Flame,
      color: "#ef4444",
    },
    {
      title: "XP Earned",
      value: "0",
      subtitle: "Level 1",
      icon: Trophy,
      color: "#8b5cf6",
    },
    {
      title: "Goals Completed",
      value: "0/0",
      subtitle: "0% progress",
      icon: Target,
      color: "#06b6d4",
    },
  ])

  useEffect(() => {
    const totalCourses = userCourses.length
    const completedCourses = userCourses.filter(uc => uc.progress === 100).length
    const inProgressCourses = totalCourses - completedCourses    
    const totalHours = userCourses.reduce((acc, uc) => {
      const duration = uc.course.duration
      if (!duration) return acc
      const hours = parseFloat(duration.match(/\d+/)?.[0] || "0")
      const completionRatio = uc.progress / 100
      return acc + (hours * completionRatio)
    }, 0)

    const totalXP = userCourses.reduce((acc, uc) => {
      return acc + (uc.progress * 10) + (uc.completedLessons * 50)
    }, 0)
    const level = Math.floor(totalXP / 1000) + 1

    const totalGoals = totalCourses
    const completedGoals = completedCourses
    const goalsProgress = totalGoals > 0 ? Math.floor((completedGoals / totalGoals) * 100) : 0

    setStats([
      {
        title: "Hours Learned",
        value: Math.floor(totalHours).toString(),
        subtitle: `This month: ${Math.floor(totalHours * 0.3)}h`,
        icon: Clock,
        color: "#4F46E5",
      },
      {
        title: "Courses Completed",
        value: completedCourses.toString(),
        subtitle: `${inProgressCourses} in progress`,
        icon: BookOpen,
        color: "#10b981",
      },
      {
        title: "Certificates Earned",
        value: completedCourses.toString(),
        subtitle: `${inProgressCourses} pending`,
        icon: Award,
        color: "#f59e0b",
      },
      {
        title: "XP Earned",
        value: Math.floor(totalXP).toLocaleString(),
        subtitle: `Level ${level}`,
        icon: Trophy,
        color: "#8b5cf6",
      },
      {
        title: "Goals Completed",
        value: `${completedGoals}/${totalGoals}`,
        subtitle: `${goalsProgress}% progress`,
        icon: Target,
        color: "#06b6d4",
      },
    ])
  }, [userCourses])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-3 md:p-4">
            <div
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-2 md:mb-3"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: stat.color }} />
            </div>
            <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs md:text-sm text-muted-foreground">{stat.title}</p>
            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
