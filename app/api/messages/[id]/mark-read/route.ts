import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Validate the ID
    if (!id) {
      return new Response("Message ID is required", { status: 400 });
    }

    // Update the message status to 'READ'
    const updatedMessage = await db.messages.update({
      where: { id },
      data: { status: "READ" },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error marking message as read:", error);
    return NextResponse.json(
      { error: "Failed to mark message as read" },
      { status: 500 }
    );
  }
}