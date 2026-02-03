"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Clock, BookOpen } from "lucide-react"
import { useCourses } from "./courses-context"

export function ContinueLearning() {
  const { enrolledCourses } = useCourses()

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Continue Learning</CardTitle>
          <Button variant="ghost" size="sm" className="text-accent">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No courses enrolled yet</p>
            <p className="text-sm">Enroll in a course to start learning</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrolledCourses.map((course, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                {/* Course Image */}
                <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {course.completedLessons}/{course.totalLessons} lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Progress value={course.progress || 0} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-foreground">{course.progress || 0}%</span>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="flex items-center">
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Play className="w-4 h-4 mr-1" />
                    Continue
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
