import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, title, details } = body;

    if (!name || !email || !title || !details) {
      return new Response("All fields are required", { status: 400 });
    }

    // Here you would typically save the message to a database
    // For demonstration, we will just return the message
    const message = {
      name,
      email,
      title,
      details,
    };

    // Simulate saving to a database
    const savedMessage = await db.messages.create({
        data: message,
    });
    
    // Return the saved message as a response
    return NextResponse.json(savedMessage, {
      status: 201,
    });

  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}