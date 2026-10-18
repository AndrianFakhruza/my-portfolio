import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Format data tidak valid, items harus berupa array" },
        { status: 400 }
      );
    }

    // Update each project's order in an atomic transaction
    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.project.update({
          where: { id: item.id },
          data: { order: Number(item.order) || 0 },
        })
      )
    );

    return NextResponse.json({ success: true, count: items.length });
  } catch (error: any) {
    console.error("Reorder projects error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memperbarui urutan proyek" },
      { status: 500 }
    );
  }
}

