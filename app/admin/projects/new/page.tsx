import prisma from "@/lib/prisma";
import { AdminProjectForm } from "@/components/admin-project-form";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return <AdminProjectForm categories={categories} isEditing={false} />;
}

