import { NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });

    const headers = ["ID", "Type", "Source", "Appareil", "Navigateur", "Pays", "Session", "Date"];
    const rows = events.map(e => [
      e.id,
      e.type,
      e.source || "",
      e.device || "",
      e.browser || "",
      e.country || "",
      e.sessionId || "",
      new Date(e.createdAt).toLocaleString("fr-FR"),
    ]);

    const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="evenements_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Erreur export" }, { status: 500 });
  }
}
