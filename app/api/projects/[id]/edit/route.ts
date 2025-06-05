import { db } from "@/lib/db";
import { Project } from "@/types/projects";
import { ProjectTags } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newProject: Project = await request.json();

    // get existing project
    const existingProject = await db.projects.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!newProject.title || !newProject.description) {
      return NextResponse.json(
        { error: "Title, description are required" },
        {
          status: 400,
        }
      );
    }

    if (
      newProject.tags &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !newProject.tags.every((tag: any) =>
        Object.values(ProjectTags).includes(tag)
      )
    ) {
      return NextResponse.json(
        { error: "Invalid tag(s) in project" },
        {
          status: 400,
        }
      );
    }

    // Update the project
    const updatedProject = await db.projects.update({
      where: { id },
      data: {
        title: newProject.title || existingProject.title,
        description: newProject.description || existingProject.description,
        tags: newProject.tags || existingProject.tags,
        features: newProject.features || existingProject.features,
        achievements: newProject.achievements || existingProject.achievements,
      },
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
