import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const capabilities = await prisma.capability.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(capabilities);
}

export async function POST(req: Request) {
  const data = await req.json();
  const cap = await prisma.capability.create({
    data: {
      title: data.title,
      skills: data.skills,
      order: data.order ?? 0,
    },
  });
  return NextResponse.json(cap, { status: 201 });
}

