"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, BookOpen } from "lucide-react"
import { useCourses } from "./courses-context"

export function ContinueLearning() {
  const { userCourses, fetchUserCourses, playCourse } = useCourses()

  useEffect(() => {
    fetchUserCourses()
  }, [])

  return (
    <Card className="bg-card border-border min-h-[300px]">
      <CardHeader>
        <CardTitle className="text-lg">Continue Learning</CardTitle>
      </CardHeader>
      <CardContent>
        {userCourses.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>Your learning journey starts here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userCourses.map((userCourse) => (
              <div key={userCourse.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <img 
                  src={userCourse.course.imageUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop"} 
                  className="w-20 h-12 object-cover rounded" 
                  alt={userCourse.course.title}
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{userCourse.course.title}</h4>
                  <Progress value={userCourse.progress} className="h-1.5 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {userCourse.completedLessons} / {userCourse.totalLessons} lessons
                  </p>
                </div>
                <Button size="icon" variant="ghost" onClick={playCourse}>
                  <Play className="w-5 h-5 fill-accent text-accent" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}