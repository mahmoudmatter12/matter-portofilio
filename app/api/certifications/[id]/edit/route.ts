import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // get the certification
    const certification = await db.certifications.findUnique({
      where: { id },
    });

    if (!certification) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    // update the certification
    const updatedCertification = await db.certifications.update({
      where: { id },
      data: await request.json(),
    });

    return NextResponse.json(updatedCertification, { status: 200 });
  } catch (error) {
    console.error("Error updating certification:", error);
    return NextResponse.json(
      { error: "Failed to update certification" },
      { status: 500 }
    );
  }
}