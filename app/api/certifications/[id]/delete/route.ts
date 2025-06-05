import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
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

    // delete the certification
    await db.certifications.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Certification deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting certification:", error);
    return NextResponse.json(
      { error: "Failed to delete certification" },
      { status: 500 }
    );
  }
}