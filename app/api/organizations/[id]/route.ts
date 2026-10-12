import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const org = await prisma.organization.update({
    where: { id },
    data: {
      role: data.role,
      organization: data.organization,
      period: data.period,
      description: data.description,
      order: data.order ?? 0,
    },
  });
  return NextResponse.json(org);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.organization.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
