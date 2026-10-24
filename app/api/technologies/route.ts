import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(technologies);
  } catch (error) {
    console.error("Technologies GET error:", error);
    return NextResponse.json({ error: "Gagal mengambil data teknologi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name?.trim()) {
      return NextResponse.json({ error: "Nama teknologi wajib diisi" }, { status: 400 });
    }
    if (!data.iconUrl?.trim()) {
      return NextResponse.json({ error: "Icon teknologi wajib diunggah" }, { status: 400 });
    }

    const tech = await prisma.technology.create({
      data: {
        name: data.name.trim(),
        iconUrl: data.iconUrl.trim(),
        order: Number(data.order) || 0,
      },
    });

    return NextResponse.json(tech, { status: 201 });
  } catch (error) {
    console.error("Technology POST error:", error);
    return NextResponse.json({ error: "Gagal menambahkan teknologi" }, { status: 500 });
  }
}
