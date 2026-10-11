import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify, calculateReadingTime } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Post GET error:", error);
    return NextResponse.json({ error: "Gagal memuat artikel" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const existing = await prisma.post.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    let slug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      slug = slugify(data.slug);
      const conflict = await prisma.post.findUnique({ where: { slug } });
      if (conflict && conflict.id !== id) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const content = data.content !== undefined ? data.content : existing.content;
    const readingTime = data.readingTime || calculateReadingTime(content);

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title.trim() : existing.title,
        slug,
        excerpt: data.excerpt !== undefined ? data.excerpt.trim() : existing.excerpt,
        content,
        cover: data.cover || existing.cover,
        tags: data.tags !== undefined ? data.tags : existing.tags,
        status: data.status || existing.status,
        readingTime,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : existing.publishedAt,
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("Post PUT error:", error);
    return NextResponse.json({ error: "Gagal memperbarui artikel" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Post DELETE error:", error);
    return NextResponse.json({ error: "Gagal menghapus artikel" }, { status: 500 });
  }
}

