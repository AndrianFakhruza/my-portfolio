import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }

    let slug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      slug = slugify(data.slug);
      const conflict = await prisma.category.findUnique({ where: { slug } });
      if (conflict && conflict.id !== id) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name.trim() : existing.name,
        slug,
        type: data.type || existing.type,
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error("Category PUT error:", error);
    return NextResponse.json({ error: "Gagal memperbarui kategori" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Cek apakah kategori ada
    const category = await prisma.category.findUnique({
      where: { id },
      include: { projects: { select: { id: true, title: true } } },
    });

    if (!category) {
      // Idempotent: jika sudah terhapus atau tidak ada di DB, kembalikan status success agar UI client sinkron
      return NextResponse.json({
        success: true,
        message: "Kategori sudah tidak ada atau telah terhapus sebelumnya.",
        alreadyDeleted: true,
      });
    }

    // Gunakan prisma transaction agar atomik dan konsisten
    await prisma.$transaction(async (tx) => {
      if (category.projects.length > 0) {
        await tx.project.deleteMany({
          where: { categoryId: id },
        });
      }
      await tx.category.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      deletedProjects: category.projects.length,
    });
  } catch (error: any) {
    console.error("Category DELETE error:", error?.message ?? error);
    return NextResponse.json(
      { error: "Gagal menghapus kategori: " + (error?.message ?? "Terjadi kesalahan server") },
      { status: 500 }
    );
  }
}
