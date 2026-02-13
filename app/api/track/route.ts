import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// This endpoint is public - used by the frontend to track events
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return NextResponse.json({ error: "Corps vide" }, { status: 400 });
    }

    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
    }

    if (typeof data.type !== "string" || data.type.length === 0) {
      return NextResponse.json({ error: "Type manquant" }, { status: 400 });
    }
    
    // Get client info from headers
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    // const forwardedFor = request.headers.get("x-forwarded-for");
    // const ip = forwardedFor?.split(",")[0] || "unknown";
    
    // Detect device type
    const isMobile = /mobile|android|iphone|ipad|tablet/i.test(userAgent);
    const device = isMobile ? "mobile" : "desktop";
    
    // Detect browser
    let browser = "unknown";
    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari")) browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";

    const event = await prisma.event.create({
      data: {
        type: data.type,
        source: referer || (typeof data.source === "string" ? data.source : undefined),
        device,
        browser,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        sessionId: typeof data.sessionId === "string" ? data.sessionId : null,
      },
    });

    return NextResponse.json({ success: true, eventId: event.id }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("Event tracking error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
