import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const profile = await prisma.aboutProfile.findFirst();
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const data = await req.json();
  const existing = await prisma.aboutProfile.findFirst();

  let profile;
  if (existing) {
    profile = await prisma.aboutProfile.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        tagline: data.tagline,
        bio1: data.bio1,
        bio2: data.bio2,
        location: data.location,
        cvUrl: data.cvUrl,
        profilePhoto: data.profilePhoto ?? existing.profilePhoto,
      },
    });
  } else {
    profile = await prisma.aboutProfile.create({ data });
  }

  return NextResponse.json(profile);
}

