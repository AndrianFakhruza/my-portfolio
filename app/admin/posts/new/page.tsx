import { AdminPostForm } from "@/components/admin-post-form";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return <AdminPostForm isEditing={false} />;
}

