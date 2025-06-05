import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const skills = await db.skills.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(skills, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      {
        status: 500,
      }
    );
  }
}

