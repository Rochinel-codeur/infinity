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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        try { meta = b.metadata ? JSON.parse(String(b.metadata)) : {}; } catch(_e) {}
        
        return {
            id: b.id,
            // @ts-expect-error: metadata type discrepancy
            message: meta.message || "Message",
            // @ts-expect-error: metadata type discrepancy
            level: meta.level || "info",
            createdAt: b.createdAt
        };
    });

    return NextResponse.json(data);
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
