import { NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const broadcasts = await prisma.event.findMany({
      where: { type: "broadcast" },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    const data = broadcasts.map(b => {
        let meta = {};
        try { meta = b.metadata ? JSON.parse(String(b.metadata)) : {}; } catch(e) {}
        
        return {
            id: b.id,
            // @ts-ignore
            message: meta.message || "Message",
            // @ts-ignore
            level: meta.level || "info",
            createdAt: b.createdAt
        };
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
