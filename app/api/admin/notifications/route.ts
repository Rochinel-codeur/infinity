import { NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Get all notifications
export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    // Get recent important events as notifications
    const recentEvents = await prisma.event.findMany({
      where: {
        type: { in: ["code_copy", "signup_click"] },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const notifications = recentEvents.map(e => {
        let read = false;
        try {
            const meta = e.metadata ? JSON.parse(String(e.metadata)) : {};
            if (meta.read) read = true;
        } catch {}

        return {
            id: e.id,
            type: e.type === "code_copy" ? "success" : "info",
            title: e.type === "code_copy" ? "Code copié !" : "Clic inscription",
            message: `Un visiteur ${e.device === "mobile" ? "mobile" : "desktop"} a ${e.type === "code_copy" ? "copié le code" : "cliqué sur inscription"}`,
            time: e.createdAt,
            read,
        };
    });

    // Count unread
    const unreadCount = notifications.filter(n => !n.read).length;

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Notifications error:", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
