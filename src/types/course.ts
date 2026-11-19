export type CourseLevel = 'Початковий' | 'Середній' | 'Просунутий'

export interface CourseModule {
  id: number
  title: string
  topics: string[]
}

export interface Course {
  id: number
  title: string
  instructor: string
  instructorBio: string
  durationHours: number
  level: CourseLevel
  studentsCount: number
  tags: string[]
  description: string
  modules: CourseModule[]
}

export interface EnrolledCourse {
  courseId: number
  completedModuleIds: number[]
}

export interface StudentProfile {
  name: string
  email: string
  avatarUrl: string
}