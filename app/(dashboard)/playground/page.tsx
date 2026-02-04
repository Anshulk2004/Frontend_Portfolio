"use client"

import { CourseCategories } from "@/components/playground/course-categories"
import { FeaturedCourses } from "@/components/playground/featured-courses"
import { MyProgress } from "@/components/playground/my-progress"
import { ContinueLearning } from "@/components/playground/continue-learning"
import { Achievements } from "@/components/playground/achievements"
import { LearningStats } from "@/components/playground/learning-stats"
import { CoursesProvider } from "@/components/playground/courses-context"

// 1. Create a separate Content component
function PlaygroundContent() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Learning Playground</h1>
          <p className="text-muted-foreground">Manage your portfolio knowledge and courses</p>
        </div>
      </div>

      <LearningStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ContinueLearning />
        </div>
        <MyProgress />
      </div>

      <CourseCategories />

      <div className="grid grid-cols-1 gap-6">
        <FeaturedCourses />
        <Achievements />
      </div>
    </div>
  )
}

// 2. The default export only handles the Provider
export default function PlaygroundPage() {
  return (
    <CoursesProvider>
      <PlaygroundContent />
    </CoursesProvider>
  )
}