import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Notifications valid for 24h
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); 
    
    const notifications = await prisma.event.findMany({
      where: {
        type: "broadcast",
        createdAt: { gte: cutoff }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    });
    
    const data = notifications.map(n => {
        let meta = {};
        try {
            meta = n.metadata ? JSON.parse(String(n.metadata)) : {};
        } catch(e) {}
        
        return {
            id: n.id,
            // @ts-ignore
            message: meta.message || "Notification",
            // @ts-ignore
            level: meta.level || "info",
            createdAt: n.createdAt
        };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Active notifications error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
