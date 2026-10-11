import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { AdminProjectForm } from "@/components/admin-project-form";

export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  const [project, categories] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!project) {
    notFound();
  }

  let galleryItems = [];
  try {
    galleryItems = JSON.parse(project.gallery || "[]");
  } catch {
    galleryItems = [];
  }

  const initialData = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    content: project.content,
    categoryId: project.categoryId,
    tags: project.tags,
    cover: project.cover,
    gallery: galleryItems,
    role: project.role,
    tools: project.tools,
    liveUrl: project.liveUrl || "",
    repoUrl: project.repoUrl || "",
    featured: project.featured,
    status: project.status,
    order: project.order,
  };

  return <AdminProjectForm initialData={initialData} categories={categories} isEditing={true} />;
}

