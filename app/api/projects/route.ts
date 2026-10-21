import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { slugify, sortProjects } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (categorySlug && categorySlug !== "all") {
      where.OR = [
        { categories: { some: { slug: categorySlug } } },
        { categoryId: (await prisma.category.findUnique({ where: { slug: categorySlug } }))?.id || "" },
      ];
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const rawProjects = await prisma.project.findMany({
      where,
      include: {
        categories: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const projects = sortProjects(rawProjects);

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Gagal mengambil data proyek" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const isGallery = data.projectType === "gallery";

    const categoryIds: string[] =
      Array.isArray(data.categoryIds) && data.categoryIds.length > 0
        ? data.categoryIds
        : data.categoryId
        ? [data.categoryId]
        : [];

    if (categoryIds.length === 0) {
      return NextResponse.json(
        { error: "Pilih minimal satu kategori proyek" },
        { status: 400 }
      );
    }

    let galleryArray: any[] = [];
    if (Array.isArray(data.gallery)) galleryArray = data.gallery;
    else if (typeof data.gallery === "string") {
      try {
        galleryArray = JSON.parse(data.gallery);
      } catch {}
    }

    if (isGallery && galleryArray.length === 0 && !data.cover) {
      return NextResponse.json(
        { error: "Unggah minimal satu gambar karya desain" },
        { status: 400 }
      );
    }

    if (!isGallery && (!data.title || !data.summary)) {
      return NextResponse.json(
        { error: "Judul, minimal satu kategori, dan ringkasan wajib diisi" },
        { status: 400 }
      );
    }

    const title = (data.title || (isGallery ? "Karya Desain" : "Proyek Tanpa Judul")).trim();
    const summary = (data.summary || (isGallery ? "Karya eksplorasi desain visual" : "")).trim();
    const cover = data.cover || galleryArray[0]?.url || "/placeholder-project.jpg";

    let slug = data.slug ? slugify(data.slug) : slugify(title);
    if (!slug) slug = `karya-${Date.now().toString().slice(-6)}`;

    // Ensure slug uniqueness
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        summary,
        content: data.content || "",
        categoryId: categoryIds[0] || null,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
        tags: data.tags || "",
        cover,
        gallery: typeof data.gallery === "string" ? data.gallery : JSON.stringify(galleryArray),
        role: data.role || "",
        tools: data.tools || "",
        liveUrl: data.liveUrl ? data.liveUrl.trim() : null,
        repoUrl: data.repoUrl ? data.repoUrl.trim() : null,
        featured: Boolean(data.featured),
        status: data.status || "published",
        order: Number(data.order) || 0,
        projectType: data.projectType || "default",
      },
      include: {
        categories: true,
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/projects");
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ error: "Gagal membuat proyek baru" }, { status: 500 });
  }
}

