import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();
  const { isUnderDev, dueDate } = data;
  if (!id) {
    return new Response("Project ID is required", { status: 400 });
  }
  console.log("Updating development status for ID:", id);
  console.log("Data received for update:", data);

  const existingDevStatus = await db.projectDevelopment.findUnique({
    where: { id },
  });

  if (!existingDevStatus) {
    return new Response("Development status not found", { status: 404 });
  }

  try {
    const updatedDevStatus = await db.projectDevelopment.update({
      where: { id },
      data: {
        isUnderDev: isUnderDev ,
        dueDate: new Date(dueDate) || existingDevStatus?.dueDate,
      },
    });

    console.log("Development status updated:", updatedDevStatus);
    return NextResponse.json(updatedDevStatus);
  } catch (error) {
    console.error("Error updating development status:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
