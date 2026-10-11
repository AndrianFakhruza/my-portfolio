import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const cap = await prisma.capability.update({
    where: { id },
    data: {
      title: data.title,
      skills: data.skills,
      order: data.order ?? 0,
    },
  });
  return NextResponse.json(cap);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.capability.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

