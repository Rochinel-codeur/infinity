
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import { triggerAdminRevalidate } from "@/lib/adminRevalidate";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const promo = await prisma.promoCode.findFirst({ where: { isActive: true } });
  return NextResponse.json({ code: promo?.code || "BCC123" });
}

export async function POST(req: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { promoCode } = await req.json();

    // Upsert the active promo code
    // For simplicity, we assume one "Active" promo code we are editing.
    // Or we update the specific one.
    // Here we will use a "SYSTEM_PROMO" key or just findFirst.
    
    // Check if a promo code exists
    const existing = await prisma.promoCode.findFirst({ where: { isActive: true } });

    if (existing) {
        await prisma.promoCode.update({
            where: { id: existing.id },
            data: { code: promoCode }
        });
    } else {
        await prisma.promoCode.create({
            data: { code: promoCode, isActive: true }
        });
    }

    await triggerAdminRevalidate(req, {
      tags: ["content:home", "settings:promo"],
      paths: ["/"],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
