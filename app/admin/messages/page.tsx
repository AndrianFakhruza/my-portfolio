import prisma from "@/lib/prisma";
import { AdminMessagesView } from "@/components/admin-messages-view";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminMessagesView initialMessages={messages} />;
}

