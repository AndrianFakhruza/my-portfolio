import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const unreadCount = await prisma.message.count({
      where: { isRead: false },
    });

    return NextResponse.json({ messages, unreadCount });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ error: "Gagal mengambil pesan" }, { status: 500 });
  }
}

