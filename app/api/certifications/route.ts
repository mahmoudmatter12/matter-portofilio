import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const certifications = await db.certifications.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(certifications, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
      {
        status: 500,
      }
    );
  }
}