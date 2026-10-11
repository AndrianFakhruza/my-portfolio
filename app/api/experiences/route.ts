import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(experiences);
}

export async function POST(req: Request) {
  const data = await req.json();
  const exp = await prisma.experience.create({
    data: {
      period: data.period,
      role: data.role,
      company: data.company,
      description: data.description,
      order: data.order ?? 0,
    },
  });
  return NextResponse.json(exp, { status: 201 });
}

