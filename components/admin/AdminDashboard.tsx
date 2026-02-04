"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AnalyticsTab } from "./AnalyticsTab";
import { UsersTab } from "./UsersTab";
import { TestimonialsTab } from "./TestimonialsTab";
import { SettingsTab } from "./SettingsTab";

interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Stats {
  overview: {
    totalUsers: number;
    totalEvents: number;
    todayUsers: number;
    todayPageViews: number;
    todayCodeCopies: number;
    todaySignupClicks: number;
    weekUsers: number;
    weekPageViews: number;
    monthUsers: number;
    conversionRate: string;
  };
  eventsByType: Array<{ type: string; count: number }>;
  recentUsers: Array<{
    id: string;
    email: string | null;
    phone: string | null;
    promoCode: string;
    source: string | null;
    device: string | null;
    status: string;
    createdAt: string;
  }>;
  dailyStats: Array<{
    date: string;
    label: string;
    users: number;
    pageViews: number;
    codeCopies: number;
  }>;
}

type TabType = "overview" | "analytics" | "users" | "testimonials" | "settings";

export function AdminDashboard({ admin }: { admin: AdminPayload }) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const tabTitles: Record<TabType, string> = {
    overview: "Vue d'ensemble",
    analytics: "Analytics",
    users: "Utilisateurs",
    testimonials: "Témoignages",
    settings: "Paramètres"
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-white dark:bg-slate-800 shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <AdminSidebar
        admin={admin}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="lg:ml-72 min-h-screen">
        <AdminHeader
          title={tabTitles[activeTab]}
          onRefresh={fetchStats}
        />

        <div className="p-6">
          {activeTab === "overview" && <OverviewTab stats={stats} isLoading={isLoading} />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "testimonials" && <TestimonialsTab />}
          {activeTab === "settings" && <SettingsTab admin={admin} />}
        </div>
      </main>
    </div>
  );
}

function OverviewTab({ stats, isLoading }: { stats: Stats | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Utilisateurs", value: stats.overview.totalUsers, icon: "👥", gradient: "from-indigo-500 to-purple-500", growth: 12 },
    { label: "Vues aujourd'hui", value: stats.overview.todayPageViews, icon: "👁️", gradient: "from-pink-500 to-rose-500", growth: 8 },
    { label: "Copies du code", value: stats.overview.todayCodeCopies, icon: "📋", gradient: "from-emerald-500 to-teal-500", growth: 24 },
    { label: "Taux conversion", value: `${stats.overview.conversionRate}%`, icon: "🎯", gradient: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="admin-glass admin-stat-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              {card.growth && (
                <span className="admin-badge admin-badge-success">+{card.growth}%</span>
              )}
            </div>
            <p className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
              {typeof card.value === "number" ? card.value.toLocaleString("fr-FR") : card.value}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-glass rounded-2xl p-6 admin-chart-container">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Activité (7 jours)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid #6366f1", borderRadius: "12px", color: "#fff" }} />
                <Line type="monotone" dataKey="pageViews" stroke="#6366f1" strokeWidth={2} dot={false} name="Vues" />
                <Line type="monotone" dataKey="codeCopies" stroke="#ec4899" strokeWidth={2} dot={false} name="Copies" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-glass rounded-2xl p-6 admin-chart-container">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Événements</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.eventsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="type" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid #6366f1", borderRadius: "12px", color: "#fff" }} />
                <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="admin-glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">Inscriptions récentes</h3>
          <span className="admin-badge admin-badge-info">{stats.recentUsers.length} récents</span>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Code</th>
                <th>Source</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">Aucun utilisateur</td></tr>
              ) : (
                stats.recentUsers.slice(0, 5).map((user) => (
                  <tr key={user.id}>
                    <td className="font-medium text-slate-900 dark:text-white">{user.email || user.phone || "—"}</td>
                    <td><span className="font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">{user.promoCode}</span></td>
                    <td className="text-slate-500">{user.source || "—"}</td>
                    <td><span className={`admin-badge ${user.status === "active" ? "admin-badge-success" : "admin-badge-warning"}`}>{user.status}</span></td>
                    <td className="text-slate-500 text-sm">{format(new Date(user.createdAt), "dd/MM HH:mm")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
