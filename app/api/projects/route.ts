import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const posts = await db.projects.findMany({
      orderBy: {
        createdAt: "desc",
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
