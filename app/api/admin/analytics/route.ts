import { NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Today's metrics
    const todayViews = await prisma.event.count({ where: { type: "page_view", createdAt: { gte: today } } });
    const todayCopies = await prisma.event.count({ where: { type: "code_copy", createdAt: { gte: today } } });
    const todaySignups = await prisma.event.count({ where: { type: "signup_click", createdAt: { gte: today } } });
    const todayDownloads = await prisma.event.count({ where: { type: "download_click", createdAt: { gte: today } } });

    // Yesterday's metrics for comparison
    const yesterdayViews = await prisma.event.count({ 
      where: { type: "page_view", createdAt: { gte: yesterday, lt: today } } 
    });
    const yesterdayCopies = await prisma.event.count({ 
      where: { type: "code_copy", createdAt: { gte: yesterday, lt: today } } 
    });

    // Conversion funnel
    const totalViews = await prisma.event.count({ where: { type: "page_view" } });
    const totalCopies = await prisma.event.count({ where: { type: "code_copy" } });
    const totalDownloads = await prisma.event.count({ where: { type: "download_click" } });
    const totalSignups = await prisma.event.count({ where: { type: "signup_click" } });

    // Calculate rates
    const copyRate = totalViews > 0 ? ((totalCopies / totalViews) * 100).toFixed(1) : "0";
    const downloadRate = totalCopies > 0 ? ((totalDownloads / totalCopies) * 100).toFixed(1) : "0";
    const signupRate = totalDownloads > 0 ? ((totalSignups / totalDownloads) * 100).toFixed(1) : "0";

    // Device breakdown
    const mobileEvents = await prisma.event.count({ where: { device: "mobile" } });
    const desktopEvents = await prisma.event.count({ where: { device: "desktop" } });
    const totalEvents = mobileEvents + desktopEvents;
    const mobilePercent = totalEvents > 0 ? ((mobileEvents / totalEvents) * 100).toFixed(0) : "0";

    // Browser breakdown
    const browsers = await prisma.event.groupBy({
      by: ["browser"],
      _count: { id: true },
      where: { browser: { not: null } },
    });

    const recentEvents = await prisma.event.findMany({
      where: {
        type: { in: ["page_view", "code_copy", "download_click", "signup_click"] },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        type: true,
        device: true,
        source: true,
        createdAt: true,
      },
    });

    // Hourly activity (last 24h)
    const hourlyData = [];
    for (let i = 23; i >= 0; i--) {
      const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
      
      const count = await prisma.event.count({
        where: { createdAt: { gte: hourStart, lt: hourEnd } },
      });
      
      hourlyData.push({
        hour: hourStart.getHours(),
        label: `${hourStart.getHours()}h`,
        events: count,
      });
    }

    // Growth calculations
    const viewsGrowth = yesterdayViews > 0 
      ? (((todayViews - yesterdayViews) / yesterdayViews) * 100).toFixed(0)
      : todayViews > 0 ? "100" : "0";
    const copiesGrowth = yesterdayCopies > 0
      ? (((todayCopies - yesterdayCopies) / yesterdayCopies) * 100).toFixed(0)
      : todayCopies > 0 ? "100" : "0";

    return NextResponse.json({
      realtime: {
        todayViews,
        todayCopies,
        todaySignups,
        todayDownloads,
        viewsGrowth: Number(viewsGrowth),
        copiesGrowth: Number(copiesGrowth),
      },
      funnel: {
        views: totalViews,
        copies: totalCopies,
        downloads: totalDownloads,
        signups: totalSignups,
        copyRate: Number(copyRate),
        downloadRate: Number(downloadRate),
        signupRate: Number(signupRate),
      },
      devices: {
        mobile: mobileEvents,
        desktop: desktopEvents,
        mobilePercent: Number(mobilePercent),
      },
      browsers: browsers.map(b => ({
        name: b.browser || "Inconnu",
        count: b._count.id,
      })),
      hourlyActivity: hourlyData,
      recentEvents,
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
