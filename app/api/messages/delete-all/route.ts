import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.messages.deleteMany();

    return new Response("All messages deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting messages:", error);
    return new Response("Failed to delete messages", { status: 500 });
  }
}
