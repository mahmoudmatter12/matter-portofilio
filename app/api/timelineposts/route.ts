import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const posts = await db.timeLinePost.findMany({
      orderBy: {
        year: "desc",
      },
    });
    return NextResponse.json(posts, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching timeline posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeline posts" },
      {
        status: 500,
      }
    );
  }
}

