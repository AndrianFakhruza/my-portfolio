import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { AdminPostForm } from "@/components/admin-post-form";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  const initialData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    cover: post.cover,
    tags: post.tags,
    status: post.status,
    readingTime: post.readingTime,
    publishedAt: post.publishedAt.toISOString(),
  };

  return <AdminPostForm initialData={initialData} isEditing={true} />;
}

