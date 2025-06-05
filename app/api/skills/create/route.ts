import { db } from "@/lib/db";
import { Skill } from "@/types/skills";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const newSkill: Skill = await request.json();
    try {

        if(!newSkill.name || !newSkill.category || !newSkill.level) {
            return NextResponse.json(
                { error: "Name, category, and level are required" },
                {
                    status: 400,
                }
            );
        }

        const createdSkill = await db.skills.create({
            data: {
                name: newSkill.name,
                category: newSkill.category,
                level: newSkill.level,
                description: newSkill.description || "",
                icon: newSkill.icon || "",
                yearsOfExperience: newSkill.yearsOfExperience || 0,
            },
        });
        return NextResponse.json(createdSkill, {
            status: 201,
        });

    } catch (error) {
        console.error("Error creating skill:", error);
        return NextResponse.json(
            { error: "Failed to create skill" },
            {
                status: 500,
            }
        );
    }
}