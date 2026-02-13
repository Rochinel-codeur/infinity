import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

type RevalidateBody = {
  secret?: string;
  tag?: string | string[];
  path?: string | string[];
};

function toArray(value?: string | string[]) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as RevalidateBody;
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret || body.secret !== expectedSecret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const tags = toArray(body.tag).filter(Boolean);
  const paths = toArray(body.path).filter(Boolean);

  tags.forEach((tag) => revalidateTag(tag));
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({
    ok: true,
    revalidated: {
      tag: tags,
      path: paths,
    },
  });
}
