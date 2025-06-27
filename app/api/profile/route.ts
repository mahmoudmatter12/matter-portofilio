import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const profile = await db.profile.findFirst();

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return NextResponse.json(profile, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
