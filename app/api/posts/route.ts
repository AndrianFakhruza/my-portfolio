import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify, calculateReadingTime } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (tag && tag !== "all") {
      where.tags = {
        contains: tag,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Posts GET error:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar artikel" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.title || !data.excerpt || !data.content) {
      return NextResponse.json(
        { error: "Judul, ringkasan, dan konten wajib diisi" },
        { status: 400 }
      );
    }

    let slug = data.slug ? slugify(data.slug) : slugify(data.title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const readingTime = data.readingTime || calculateReadingTime(data.content);

    const post = await prisma.post.create({
      data: {
        title: data.title.trim(),
        slug,
        excerpt: data.excerpt.trim(),
        content: data.content,
        cover: data.cover || "/placeholder-post.jpg",
        tags: data.tags || "",
        status: data.status || "published",
        readingTime,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Posts POST error:", error);
    return NextResponse.json({ error: "Gagal membuat artikel baru" }, { status: 500 });
  }
}

