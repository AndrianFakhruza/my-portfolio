import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const educations = await prisma.education.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(educations);
}

export async function POST(req: Request) {
  const data = await req.json();
  const edu = await prisma.education.create({
    data: {
      institution: data.institution,
      degree: data.degree,
      period: data.period,
      score: data.score || null,
      description: data.description || null,
      order: data.order ?? 0,
    },
  });
  return NextResponse.json(edu, { status: 201 });
}

