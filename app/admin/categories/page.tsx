import prisma from "@/lib/prisma";
import { AdminCategoriesView } from "@/components/admin-categories-view";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { projects: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return <AdminCategoriesView initialCategories={categories} />;
}

