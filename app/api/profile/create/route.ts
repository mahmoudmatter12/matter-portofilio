import { db } from "@/lib/db";
import { CreateProfile } from "@/types/profile";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {

    const newProfile: CreateProfile = await request.json();
    
    // Create profile in the database
    const createdProfile = await db.profile.create({
      data: newProfile,
    });

    return NextResponse.json(createdProfile, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}