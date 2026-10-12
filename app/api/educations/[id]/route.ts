import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const edu = await prisma.education.update({
    where: { id },
    data: {
      institution: data.institution,
      degree: data.degree,
      period: data.period,
      score: data.score || null,
      description: data.description || null,
      order: data.order ?? 0,
    },
  });
  return NextResponse.json(edu);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.education.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

