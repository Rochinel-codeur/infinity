import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// This endpoint is public - used by the frontend to track events
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Get client info from headers
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] || "unknown";
    
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
        source: referer || data.source,
        device,
        browser,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        sessionId: data.sessionId,
      },
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error) {
    console.error("Event tracking error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
