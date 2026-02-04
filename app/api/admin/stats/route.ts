import { NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const admin = await getAdminFromCookies();
  
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    // Get current date and dates for comparison
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total stats
    const totalUsers = await prisma.user.count();
    const totalEvents = await prisma.event.count();
    
    // Today's stats
    const todayUsers = await prisma.user.count({
      where: { createdAt: { gte: today } }
    });
    
    const todayPageViews = await prisma.event.count({
      where: { type: "page_view", createdAt: { gte: today } }
    });
    
    const todayCodeCopies = await prisma.event.count({
      where: { type: "code_copy", createdAt: { gte: today } }
    });
    
    const todaySignupClicks = await prisma.event.count({
      where: { type: "signup_click", createdAt: { gte: today } }
    });

    // This week stats
    const weekUsers = await prisma.user.count({
      where: { createdAt: { gte: thisWeekStart } }
    });
    
    const weekPageViews = await prisma.event.count({
      where: { type: "page_view", createdAt: { gte: thisWeekStart } }
    });

    // This month stats
    const monthUsers = await prisma.user.count({
      where: { createdAt: { gte: thisMonthStart } }
    });

    // Event breakdown by type
    const eventsByType = await prisma.event.groupBy({
      by: ["type"],
      _count: { id: true },
    });

    // Recent users
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        phone: true,
        promoCode: true,
        source: true,
        device: true,
        status: true,
        createdAt: true,
      },
    });

    // Daily stats for chart (last 7 days)
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const users = await prisma.user.count({
        where: {
          createdAt: { gte: date, lt: nextDate }
        }
      });

      const pageViews = await prisma.event.count({
        where: {
          type: "page_view",
          createdAt: { gte: date, lt: nextDate }
        }
      });

      const codeCopies = await prisma.event.count({
        where: {
          type: "code_copy",
          createdAt: { gte: date, lt: nextDate }
        }
      });

      dailyStats.push({
        date: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }),
        users,
        pageViews,
        codeCopies,
      });
    }

    // Calculate conversion rate
    const totalPageViews = await prisma.event.count({ where: { type: "page_view" } });
    const totalCodeCopies = await prisma.event.count({ where: { type: "code_copy" } });
    const conversionRate = totalPageViews > 0 ? ((totalCodeCopies / totalPageViews) * 100).toFixed(1) : "0";

    return NextResponse.json({
      overview: {
        totalUsers,
        totalEvents,
        todayUsers,
        todayPageViews,
        todayCodeCopies,
        todaySignupClicks,
        weekUsers,
        weekPageViews,
        monthUsers,
        conversionRate,
      },
      eventsByType: eventsByType.map(e => ({
        type: e.type,
        count: e._count.id,
      })),
      recentUsers,
      dailyStats,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
