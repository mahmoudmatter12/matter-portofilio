import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    const unreadMessages = await db.messages.findMany({
        where: {
            status: "NEW",
        },
    });
    return NextResponse.json({ count: unreadMessages.length }, {
        status: 200,
    });

}