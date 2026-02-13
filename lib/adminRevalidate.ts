import { revalidatePath, revalidateTag } from "next/cache";

interface AdminRevalidateParams {
  tags?: string[];
  paths?: string[];
}

export async function triggerAdminRevalidate(request: Request, params: AdminRevalidateParams) {
  void request;
  const tags = (params.tags || []).filter(Boolean);
  const paths = (params.paths || []).filter(Boolean);

  if (tags.length === 0 && paths.length === 0) return;

  tags.forEach((tag) => revalidateTag(tag));
  paths.forEach((path) => revalidatePath(path));

  const secret = process.env.REVALIDATE_SECRET;
  if (secret) {
    try {
      const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
      if (!origin) return;
      await fetch(`${origin}/api/admin/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          secret,
          tag: tags,
          path: paths,
        }),
      });
    } catch (error) {
      console.error("Admin revalidate webhook call error:", error);
    }
  }
}
