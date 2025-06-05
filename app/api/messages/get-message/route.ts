import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const messages = await db.messages.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(messages, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      {
        status: 500,
      }
    );
  }
}
