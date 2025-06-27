import { SkillCategory, SkillLevel } from "@prisma/client";

export type { SkillCategory, SkillLevel };

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  description?: string;
  icon?: string;
  yearsOfExperience?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const SkillCategory = {
  FRONTEND: "FRONTEND",
  BACKEND: "BACKEND",
  DEVOPS: "DEVOPS",
  MOBILE: "MOBILE",
  DATA: "DATA",
  OTHER: "OTHER",
} as const;
export type SkillCategory =
  | keyof typeof SkillCategory
  | (typeof SkillCategory)[keyof typeof SkillCategory];

export enum SkillLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}
