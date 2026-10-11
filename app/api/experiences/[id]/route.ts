import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const exp = await prisma.experience.update({
    where: { id },
    data: {
      period: data.period,
      role: data.role,
      company: data.company,
      description: data.description,
      order: data.order ?? 0,
    },
  });
  return NextResponse.json(exp);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

