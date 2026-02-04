"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Award,
  Flame,
  BookOpen,
  Target,
  Star,
  Lock,
} from "lucide-react"

const achievements = [
  {
    name: "First Steps",
    description: "Complete your first lesson",
    icon: BookOpen,
    earned: true,
    date: "Jan 15, 2026",
    xp: 100,
  },
  {
    name: "Knowledge Seeker",
    description: "Complete 10 lessons",
    icon: Target,
    earned: true,
    date: "Feb 02, 2026",
    xp: 250,
  },
  {
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: Flame,
    earned: true,
    date: "Feb 04, 2026",
    xp: 500,
  },
  {
    name: "Course Champion",
    description: "Complete your first course",
    icon: Award,
    earned: false,
    date: null,
    xp: 750,
  },
  {
    name: "Portfolio Master",
    description: "Achieve 90%+ on 5 quizzes",
    icon: Star,
    earned: false,
    date: null,
    xp: 500,
  },
]

export function Achievements() {
  const earnedCount = achievements.filter(a => a.earned).length
  const progressPercentage = (earnedCount / achievements.length) * 100

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            <CardTitle className="text-lg font-semibold text-foreground">Achievements</CardTitle>
          </div>
          <div className="flex items-center gap-3 min-w-[200px]">
            <Progress value={progressPercentage} className="h-2 flex-1" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {earnedCount}/{achievements.length} unlocked
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-lg border transition-colors flex flex-col items-center text-center ${
                achievement.earned 
                  ? "bg-muted/50 border-border" 
                  : "bg-background border-dashed opacity-60"
              }`}
            >
              {!achievement.earned && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              )}

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                  achievement.earned ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                }`}
              >
                <achievement.icon className="w-5 h-5" />
              </div>

              <h4 className="text-sm font-medium text-foreground mb-1">
                {achievement.name}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {achievement.description}
              </p>

              <div className="mt-auto w-full">
                <span className={`text-xs font-medium ${
                  achievement.earned ? "text-accent" : "text-muted-foreground"
                }`}>
                  +{achievement.xp} XP
                </span>
                {achievement.earned && achievement.date && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {achievement.date}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}