import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const organizations = await prisma.organization.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(organizations);
}

export async function POST(req: Request) {
  const data = await req.json();
  const org = await prisma.organization.create({
    data: {
      role: data.role,
      organization: data.organization,
      period: data.period,
      description: data.description,
      order: data.order ?? 0,
    },
  });
  return NextResponse.json(org, { status: 201 });
}

