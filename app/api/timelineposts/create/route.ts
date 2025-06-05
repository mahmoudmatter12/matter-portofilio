import { TimeLinePostType } from '@prisma/client';
import { db } from "@/lib/db";
import { TimelinePost } from "@/types/timelineposts";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {

    const newPost : TimelinePost = await request.json();
    
    if(!newPost.title || !newPost.year || !newPost.description || !newPost.type) {
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

    const createdPost = await db.timeLinePost.create({
      data: {
        title: newPost.title,
        institution: newPost.institution,
        location: newPost.location,
        year: newPost.year,
        description: newPost.description,
        type: newPost.type,
        link: newPost.link,
      },
    });

    return NextResponse.json(createdPost, {
      status: 201,
    });


  } catch (error) {
    console.error("Error creating timeline post:", error);
    return NextResponse.json(
      { error: "Failed to create timeline post" },
      {
        status: 500,
      }
    );
  }
}
