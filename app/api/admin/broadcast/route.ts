import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { message, level } = body;

    if (!message) {
        return NextResponse.json({ error: "Message requis" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        type: "broadcast",
        source: "admin",
        device: "server",
        browser: "server",
        metadata: JSON.stringify({ message, level: level || "info" }),
        // Using event table as simplified storage for notifications
      }
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Broadcast error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
