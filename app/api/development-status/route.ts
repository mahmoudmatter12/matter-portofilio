import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const devstatus = await db.projectDevelopment.findMany();
  if (!devstatus) {
    return new Response(JSON.stringify(devstatus), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  console.log("Development status fetched:", devstatus);
  return NextResponse.json(devstatus);
}


export async function POST(request: Request) {
    const data = await request.json();
  const {  isUnderDev, dueDate } = data;
  console.log("Received data for development status:", data);
  

  try {
      const newDevStatus = await db.projectDevelopment.create({
      data: {
          isUnderDev,
          dueDate: new Date(dueDate),
        },
    });

    console.log("New development status created:", newDevStatus);
    return NextResponse.json({ status: newDevStatus }, { status: 201 });
} catch (error) {
    console.error("Error creating development status:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}


export const dynamic = "force-dynamic";