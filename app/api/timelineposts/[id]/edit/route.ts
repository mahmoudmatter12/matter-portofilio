import { db } from "@/lib/db";
import { TimelinePost } from "@/types/timelineposts";
import { TimeLinePostType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const newPost: TimelinePost = await request.json();

    // get existing post
    const existingPost = await db.timeLinePost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (
      !newPost.title ||
      !newPost.year ||
      !newPost.description ||
      !newPost.type
    ) {
      return NextResponse.json(
        { error: "Title, year, description, and type are required" },
        {
          status: 400,
        }
      );
    }

    // Validate the type
    if (!Object.values(TimeLinePostType).includes(newPost.type)) {
      return NextResponse.json(
        { error: "Invalid post type" },
        {
          status: 400,
        }
      );
    }

    // Update the post
    const updatedPost = await db.timeLinePost.update({
      where: { id },
      data: {
        title: newPost.title || existingPost.title,
        year: newPost.year || existingPost.year,
        description: newPost.description || existingPost.description,
        type: newPost.type || existingPost.type,
        institution: newPost.institution ||  null,
        location: newPost.location || null,
        link: newPost.link || null,
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
