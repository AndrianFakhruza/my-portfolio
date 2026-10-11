import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

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
      where.category = {
        slug: categorySlug,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Gagal mengambil data proyek" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.title || !data.categoryId || !data.summary) {
      return NextResponse.json(
        { error: "Judul, kategori, dan ringkasan wajib diisi" },
        { status: 400 }
      );
    }

    let slug = data.slug ? slugify(data.slug) : slugify(data.title);
    // Ensure slug uniqueness
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const project = await prisma.project.create({
      data: {
        title: data.title.trim(),
        slug,
        summary: data.summary.trim(),
        content: data.content || "",
        categoryId: data.categoryId,
        tags: data.tags || "",
        cover: data.cover || "/placeholder-project.jpg",
        gallery: typeof data.gallery === "string" ? data.gallery : JSON.stringify(data.gallery || []),
        role: data.role || "",
        tools: data.tools || "",
        liveUrl: data.liveUrl ? data.liveUrl.trim() : null,
        repoUrl: data.repoUrl ? data.repoUrl.trim() : null,
        featured: Boolean(data.featured),
        status: data.status || "published",
        order: Number(data.order) || 0,
      },
      include: {
        category: true,
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

