import { db } from "@/lib/db";
import { Project } from "@/types/projects";
import { ProjectTags } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const newProject: Project = await request.json();

    if (!newProject.title || !newProject.description) {
      return new Response("Title and description are required", {
        status: 400,
      });
    }
    // Validate the project data
    if (newProject.tags && !Array.isArray(newProject.tags)) {
      return new Response("Tags must be an array", { status: 400 });
    }
    if (newProject.features && !Array.isArray(newProject.features)) {
      return new Response("Features must be an array", { status: 400 });
    }
    if (newProject.achievements && !Array.isArray(newProject.achievements)) {
      return new Response("Achievements must be an array", { status: 400 });
    }
    // validate the project data types
    if (
      newProject.tags &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !newProject.tags.every((tag: any) => Object.values(ProjectTags).includes(tag))
    ) {
      return NextResponse.json(
        { error: "Invalid tag(s) in project" },
        {
          status: 400,
        }
      );
    }
    // create the project in the database
    const createdProject = await db.projects.create({
      data: newProject,
    });
    // Return the created project
    if (!createdProject) {
      return new Response("Failed to create project", { status: 500 });
    }
    // Return the created project with a 201 status
    return NextResponse.json(createdProject, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      {
        status: 500,
      }
    );
  }
}
