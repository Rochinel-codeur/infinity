import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { triggerAdminRevalidate } from "@/lib/adminRevalidate";
import { Prisma } from "@prisma/client";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

let isScreenshotSchemaReady = false;

async function ensureScreenshotVisibilityColumns() {
  if (isScreenshotSchemaReady) return;

  const columns = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
    `PRAGMA table_info("WinningScreenshot")`
  );
  const existing = new Set((columns || []).map((column) => column.name));

  const missingStatements: string[] = [];
  if (!existing.has("showName")) {
    missingStatements.push(`ALTER TABLE "WinningScreenshot" ADD COLUMN "showName" INTEGER NOT NULL DEFAULT 1`);
  }
  if (!existing.has("showMessage")) {
    missingStatements.push(`ALTER TABLE "WinningScreenshot" ADD COLUMN "showMessage" INTEGER NOT NULL DEFAULT 1`);
  }
  if (!existing.has("showAmount")) {
    missingStatements.push(`ALTER TABLE "WinningScreenshot" ADD COLUMN "showAmount" INTEGER NOT NULL DEFAULT 1`);
  }
  if (!existing.has("showTime")) {
    missingStatements.push(`ALTER TABLE "WinningScreenshot" ADD COLUMN "showTime" INTEGER NOT NULL DEFAULT 1`);
  }

  for (const statement of missingStatements) {
    await prisma.$executeRawUnsafe(statement);
  }

  isScreenshotSchemaReady = true;
}

function toSqlBoolean(value: unknown, defaultValue = true) {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "bigint") return value !== BigInt(0);
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "") return defaultValue;
    if (["false", "0", "off", "no"].includes(normalized)) return false;
    if (["true", "1", "on", "yes"].includes(normalized)) return true;
    const parsed = Number(normalized);
    if (!Number.isNaN(parsed)) return parsed !== 0;
    return defaultValue;
  }
  return Boolean(value);
}

async function updateScreenshotVisibilityFlags(
  id: string,
  flags: { showName: boolean; showMessage: boolean; showAmount: boolean; showTime: boolean }
) {
  await prisma.$executeRawUnsafe(
    `UPDATE "WinningScreenshot"
     SET "showName" = ?, "showMessage" = ?, "showAmount" = ?, "showTime" = ?, "updatedAt" = CURRENT_TIMESTAMP
     WHERE "id" = ?`,
    flags.showName ? 1 : 0,
    flags.showMessage ? 1 : 0,
    flags.showAmount ? 1 : 0,
    flags.showTime ? 1 : 0,
    id
  );
}

async function uploadFile(file: File) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  } catch (e) {
    console.error("Upload error", e);
    return null;
  }
}

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    await ensureScreenshotVisibilityColumns();

    const screenshots = await prisma.$queryRawUnsafe<
      Array<{
        id: string;
        name: string;
        message: string;
        amount: string;
        time: string;
        imageUrl: string | null;
        type: string;
        isActive: boolean | number;
        order: number;
        createdAt: string;
        updatedAt: string;
        showName: boolean | number;
        showMessage: boolean | number;
        showAmount: boolean | number;
        showTime: boolean | number;
      }>
    >(
      `SELECT
        "id",
        "name",
        "message",
        "amount",
        "time",
        "imageUrl",
        "type",
        "isActive",
        "order",
        "createdAt",
        "updatedAt",
        COALESCE("showName", 1) as "showName",
        COALESCE("showMessage", 1) as "showMessage",
        COALESCE("showAmount", 1) as "showAmount",
        COALESCE("showTime", 1) as "showTime"
      FROM "WinningScreenshot"
      ORDER BY "order" ASC, "createdAt" DESC`
    );

    const normalized = screenshots.map((item) => ({
      ...item,
      isActive: toSqlBoolean(item.isActive, false),
      showName: toSqlBoolean(item.showName, true),
      showMessage: toSqlBoolean(item.showMessage, true),
      showAmount: toSqlBoolean(item.showAmount, true),
      showTime: toSqlBoolean(item.showTime, true),
    }));
    return NextResponse.json({ screenshots: normalized });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    await ensureScreenshotVisibilityColumns();

    const formData = await request.formData();
    const rawName = formData.get("name");
    const name = typeof rawName === "string" && rawName.trim().length > 0 ? rawName.trim() : "Capture verifiee";
    const message = formData.get("message") as string;
    const amount = formData.get("amount") as string;
    const time = formData.get("time") as string;
    const type = formData.get("type") as string || "win";
    const isActive = formData.get("isActive") === "true";
    const visibilityFlags = {
      showName: toSqlBoolean(formData.get("showName"), true),
      showMessage: toSqlBoolean(formData.get("showMessage"), true),
      showAmount: toSqlBoolean(formData.get("showAmount"), true),
      showTime: toSqlBoolean(formData.get("showTime"), true),
    };
    
    let imageUrl = formData.get("imageUrl") as string;
    const file = formData.get("file") as File | null;

    if (file && file.size > 0) {
      const uploaded = await uploadFile(file);
      if (uploaded) imageUrl = uploaded;
    }

    const screenshot = await prisma.winningScreenshot.create({
      data: {
        name,
        message,
        amount,
        time,
        type,
        isActive,
        imageUrl,
      },
    });

    await updateScreenshotVisibilityFlags(screenshot.id, visibilityFlags);

    await triggerAdminRevalidate(request, {
      tags: ["content:home", "content:screenshots"],
      paths: ["/"],
    });

    return NextResponse.json({ screenshot });
  } catch (e: unknown) {
    console.error("Create error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    await ensureScreenshotVisibilityColumns();

    const contentType = request.headers.get("content-type") || "";
    let id: string;
    const data: Prisma.WinningScreenshotUpdateInput = {};
    let visibilityFlags:
      | { showName: boolean; showMessage: boolean; showAmount: boolean; showTime: boolean }
      | null = null;

    if (contentType.includes("application/json")) {
      const json = await request.json();
      id = json.id;
      if (json.isActive !== undefined) data.isActive = json.isActive;
      if (typeof json.name === "string") {
        data.name = json.name.trim() || "Capture verifiee";
      }
      if (json.message) data.message = json.message;
      if (json.amount) data.amount = json.amount;
      if (json.time) data.time = json.time;
      if (json.type) data.type = json.type;
      if (
        json.showName !== undefined ||
        json.showMessage !== undefined ||
        json.showAmount !== undefined ||
        json.showTime !== undefined
      ) {
        visibilityFlags = {
          showName: toSqlBoolean(json.showName, true),
          showMessage: toSqlBoolean(json.showMessage, true),
          showAmount: toSqlBoolean(json.showAmount, true),
          showTime: toSqlBoolean(json.showTime, true),
        };
      }
    } else {
      const formData = await request.formData();
      id = formData.get("id") as string;
      
      const name = formData.get("name");
      if (typeof name === "string") data.name = name.trim() || "Capture verifiee";
      
      const message = formData.get("message") as string;
      if (message) data.message = message;
      
      const amount = formData.get("amount") as string;
      if (amount) data.amount = amount;
      
      const time = formData.get("time") as string;
      if (time) data.time = time;

      const type = formData.get("type") as string;
      if (type) data.type = type;

      const showName = formData.get("showName");
      const showMessage = formData.get("showMessage");
      const showAmount = formData.get("showAmount");
      const showTime = formData.get("showTime");
      if (showName !== null || showMessage !== null || showAmount !== null || showTime !== null) {
        visibilityFlags = {
          showName: toSqlBoolean(showName, true),
          showMessage: toSqlBoolean(showMessage, true),
          showAmount: toSqlBoolean(showAmount, true),
          showTime: toSqlBoolean(showTime, true),
        };
      }
      
      const isActive = formData.get("isActive");
      if (isActive !== null) data.isActive = isActive === "true";

      let imageUrl = formData.get("imageUrl") as string;
      const file = formData.get("file") as File | null;

      if (file && file.size > 0) {
        const uploaded = await uploadFile(file);
        if (uploaded) imageUrl = uploaded;
      }
      if (imageUrl) data.imageUrl = imageUrl;
    }

    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const screenshot = await prisma.winningScreenshot.update({
      where: { id },
      data,
    });

    if (visibilityFlags) {
      await updateScreenshotVisibilityFlags(id, visibilityFlags);
    }

    await triggerAdminRevalidate(request, {
      tags: ["content:home", "content:screenshots"],
      paths: ["/"],
    });

    return NextResponse.json({ screenshot });
  } catch (e: unknown) {
    console.error("Update error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    await ensureScreenshotVisibilityColumns();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    await prisma.winningScreenshot.delete({ where: { id } });
    await triggerAdminRevalidate(request, {
      tags: ["content:home", "content:screenshots"],
      paths: ["/"],
    });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
