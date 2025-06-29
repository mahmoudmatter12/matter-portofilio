import { ProjectTags } from "@prisma/client";

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  github?: string;
  live?: string;
  tags: ProjectTags[];
  features: string[];
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}
