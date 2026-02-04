import { NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        phone: true,
        promoCode: true,
        source: true,
        device: true,
        browser: true,
        country: true,
        status: true,
        createdAt: true,
      },
    });

    // Create CSV content
    const headers = ["ID", "Email", "Téléphone", "Code Promo", "Source", "Appareil", "Navigateur", "Pays", "Statut", "Date"];
    const rows = users.map(u => [
      u.id,
      u.email || "",
      u.phone || "",
      u.promoCode,
      u.source || "",
      u.device || "",
      u.browser || "",
      u.country || "",
      u.status,
      new Date(u.createdAt).toLocaleString("fr-FR"),
    ]);

    const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="utilisateurs_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Erreur export" }, { status: 500 });
  }
}
