import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const tech = await prisma.technology.update({
      where: { id },
      data: {
        name: data.name ? data.name.trim() : undefined,
        iconUrl: data.iconUrl ? data.iconUrl.trim() : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });

    return NextResponse.json(tech);
  } catch (error) {
    console.error("Technology PUT error:", error);
    return NextResponse.json({ error: "Gagal memperbarui teknologi" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.technology.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Technology DELETE error:", error);
    return NextResponse.json({ error: "Gagal menghapus teknologi" }, { status: 500 });
  }
}
