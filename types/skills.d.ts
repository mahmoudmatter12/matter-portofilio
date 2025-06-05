import { SkillCategory, SkillLevel } from "@prisma/client"

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  level: SkillLevel
  description?: string
  icon?: string
  yearsOfExperience?: number
  createdAt: Date
  updatedAt: Date
}