import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import { triggerAdminRevalidate } from "@/lib/adminRevalidate";

const MEMBER_AVATARS_SETTING_KEY = "heroMemberAvatars";
const MAX_MEMBER_AVATARS = 5;

function parseAvatars(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_MEMBER_AVATARS);
  } catch {
    return [];
  }
}

async function getStoredAvatars() {
  const setting = await prisma.setting.findUnique({
    where: { key: MEMBER_AVATARS_SETTING_KEY },
  });
  return parseAvatars(setting?.value);
}

async function storeAvatars(avatars: string[]) {
  await prisma.setting.upsert({
    where: { key: MEMBER_AVATARS_SETTING_KEY },
    update: { value: JSON.stringify(avatars.slice(0, MAX_MEMBER_AVATARS)) },
    create: {
      key: MEMBER_AVATARS_SETTING_KEY,
      value: JSON.stringify(avatars.slice(0, MAX_MEMBER_AVATARS)),
    },
  });
}

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const avatars = await getStoredAvatars();
  return NextResponse.json({ avatars, max: MAX_MEMBER_AVATARS });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const candidate =
      (formData.get("file") as File | null) ||
      (formData.getAll("files").find((entry): entry is File => entry instanceof File && entry.size > 0) ?? null);

    if (!candidate || candidate.size === 0) {
      return NextResponse.json({ error: "Aucun fichier valide" }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), "public/uploads/members");
    await mkdir(uploadDir, { recursive: true });

    const existing = await getStoredAvatars();
    if (existing.length >= MAX_MEMBER_AVATARS) {
      return NextResponse.json(
        { error: "Maximum 5 photos atteint. Supprimez une photo avant d'en ajouter." },
        { status: 400 }
      );
    }

    const bytes = await candidate.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = candidate.name.replace(/[^a-zA-Z0-9.-]/g, "");
    const filename = `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    await writeFile(join(uploadDir, filename), buffer);
    const uploadedUrl = `/uploads/members/${filename}`;

    const avatars = [...existing, uploadedUrl].slice(0, MAX_MEMBER_AVATARS);
    await storeAvatars(avatars);

    await triggerAdminRevalidate(request, {
      tags: ["content:home", "settings:member-avatars"],
      paths: ["/"],
    });

    return NextResponse.json({
      avatars,
      added: 1,
      max: MAX_MEMBER_AVATARS,
    });
  } catch (error) {
    console.error("Member avatars upload error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { index } = (await request.json()) as { index?: number };
    if (typeof index !== "number" || index < 0) {
      return NextResponse.json({ error: "Index invalide" }, { status: 400 });
    }

    const current = await getStoredAvatars();
    if (index >= current.length) {
      return NextResponse.json({ error: "Index hors limite" }, { status: 400 });
    }

    const avatars = current.filter((_, itemIndex) => itemIndex !== index);
    await storeAvatars(avatars);

    await triggerAdminRevalidate(request, {
      tags: ["content:home", "settings:member-avatars"],
      paths: ["/"],
    });

    return NextResponse.json({ avatars, max: MAX_MEMBER_AVATARS });
  } catch (error) {
    console.error("Member avatars delete error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
