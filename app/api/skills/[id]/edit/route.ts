import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const updatedSkill = await request.json();

  try {
    if (!updatedSkill.name || !updatedSkill.category || !updatedSkill.level) {
      return NextResponse.json(
        { error: "Name, category, and level are required" },
        {
          status: 400,
        }
      );
    }

    const existingSkill = await db.skills.findUnique({
      where: { id: id },
    });

    if (!existingSkill) {
      return NextResponse.json(
        { error: "Skill not found" },
        {
          status: 404,
        }
      );
    }

    const updated = await db.skills.update({
      where: { id: id },
      data: {
        name: updatedSkill.name,
        category: updatedSkill.category,
        level: updatedSkill.level,
        description: updatedSkill.description || "",
        icon: updatedSkill.icon || "",
        yearsOfExperience: updatedSkill.yearsOfExperience || 0,
      },
    });

    return NextResponse.json(updated, {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
      {
        status: 500,
      }
    );
  }
}
