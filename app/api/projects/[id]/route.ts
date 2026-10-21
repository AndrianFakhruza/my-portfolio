import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        categories: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Project GET error:", error);
    return NextResponse.json({ error: "Gagal memuat proyek" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
    }

    let slug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      slug = slugify(data.slug);
      const conflict = await prisma.project.findUnique({ where: { slug } });
      if (conflict && conflict.id !== id) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    let updateCategoriesObj: any = undefined;
    let newCategoryId: string | undefined = undefined;

    if (Array.isArray(data.categoryIds) && data.categoryIds.length > 0) {
      updateCategoriesObj = {
        set: data.categoryIds.map((catId: string) => ({ id: catId })),
      };
      newCategoryId = data.categoryIds[0];
    } else if (data.categoryId) {
      updateCategoriesObj = {
        set: [{ id: data.categoryId }],
      };
      newCategoryId = data.categoryId;
    }

    let cover = data.cover || existing.cover;
    let galleryString = typeof data.gallery === "string" ? data.gallery : JSON.stringify(data.gallery || []);
    if (data.projectType === "gallery") {
      try {
        const parsed = JSON.parse(galleryString);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.url) {
          cover = parsed[0].url;
        }
      } catch {}
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title.trim() : existing.title,
        slug,
        summary: data.summary !== undefined ? data.summary.trim() : existing.summary,
        content: data.content !== undefined ? data.content : existing.content,
        categoryId: newCategoryId || existing.categoryId,
        categories: updateCategoriesObj,
        tags: data.tags !== undefined ? data.tags : existing.tags,
        cover,
        gallery: galleryString,
        role: data.role !== undefined ? data.role : existing.role,
        tools: data.tools !== undefined ? data.tools : existing.tools,
        liveUrl: data.liveUrl !== undefined ? (data.liveUrl ? data.liveUrl.trim() : null) : existing.liveUrl,
        repoUrl: data.repoUrl !== undefined ? (data.repoUrl ? data.repoUrl.trim() : null) : existing.repoUrl,
        featured: data.featured !== undefined ? Boolean(data.featured) : existing.featured,
        status: data.status || existing.status,
        order: data.order !== undefined ? Number(data.order) : existing.order,
        projectType: data.projectType !== undefined ? data.projectType : existing.projectType,
      },
      include: {
        categories: true,
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/projects");
      revalidatePath(`/projects/${updated.slug}`);
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Project PUT error:", error);
    return NextResponse.json({ error: "Gagal memperbarui proyek" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id },
    });

    try {
      revalidatePath("/");
      revalidatePath("/projects");
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project DELETE error:", error);
    return NextResponse.json({ error: "Gagal menghapus proyek" }, { status: 500 });
  }
}

