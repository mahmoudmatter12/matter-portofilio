import { db } from "@/lib/db";
import { profileType } from "@/types/profile";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const profileData: profileType = await request.json();
  console.log("Received profile data:", profileData);
  try {
    // Update profile in the database
    const { id, ...fieldsToUpdate } = profileData;
    const updatedProfile = await db.profile.update({
      where: { id },
      data: fieldsToUpdate,
    });
    return NextResponse.json(updatedProfile, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
