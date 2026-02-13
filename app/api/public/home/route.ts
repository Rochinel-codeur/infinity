import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureDefaultTextTestimonials } from "@/lib/defaultTestimonials";

const TUTORIAL_VIDEO_SETTING_KEY = "tutorialVideoId";
const MEMBER_AVATARS_SETTING_KEY = "heroMemberAvatars";
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

function toBoolean(value: unknown, defaultValue = true) {
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

function parseMemberAvatars(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string").slice(0, 5);
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    await ensureDefaultTextTestimonials();
    await ensureScreenshotVisibilityColumns();

    const [testimonials, videos, screenshots, promo, tutorialSetting, memberAvatarsSetting] = await Promise.all([
      prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.video.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.$queryRawUnsafe<
        Array<{
          id: string;
          name: string;
          message: string;
          amount: string;
          time: string;
          imageUrl: string | null;
          type: string;
          isActive: boolean | number | string;
          order: number;
          createdAt: string;
          updatedAt: string;
          showName: boolean | number | string;
          showMessage: boolean | number | string;
          showAmount: boolean | number | string;
          showTime: boolean | number | string;
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
        WHERE "isActive" = 1
        ORDER BY "order" ASC, "createdAt" DESC`
      ),
      prisma.promoCode.findFirst({
        where: { isActive: true },
      }),
      prisma.setting.findUnique({
        where: { key: TUTORIAL_VIDEO_SETTING_KEY },
      }),
      prisma.setting.findUnique({
        where: { key: MEMBER_AVATARS_SETTING_KEY },
      }),
    ]);

    return NextResponse.json({
      testimonials,
      videos,
      screenshots: screenshots.map((item) => ({
        ...item,
        isActive: toBoolean(item.isActive, true),
        showName: toBoolean(item.showName, true),
        showMessage: toBoolean(item.showMessage, true),
        showAmount: toBoolean(item.showAmount, true),
        showTime: toBoolean(item.showTime, true),
      })),
      promoCode: promo?.code || "BCC123",
      tutorialVideoId: tutorialSetting?.value || null,
      memberAvatars: parseMemberAvatars(memberAvatarsSetting?.value),
    });
  } catch (error) {
    console.error("Public home content fetch error:", error);
    return NextResponse.json(
      {
        testimonials: [],
        videos: [],
        screenshots: [],
        promoCode: "BCC123",
        tutorialVideoId: null,
        memberAvatars: [],
      },
      { status: 500 }
    );
  }
}
