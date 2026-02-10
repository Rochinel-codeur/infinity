"use client";

import { useEffect, useState } from "react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

interface AnalyticsData {
  realtime: {
    todayViews: number;
    todayCopies: number;
    todaySignups: number;
    todayDownloads: number;
    viewsGrowth: number;
    copiesGrowth: number;
  };
  funnel: {
    views: number;
    copies: number;
    downloads: number;
    signups: number;
    copyRate: number;
    downloadRate: number;
    signupRate: number;
  };
  devices: {
    mobile: number;
    desktop: number;
    mobilePercent: number;
  };
  browsers: Array<{ name: string; count: number }>;
  hourlyActivity: Array<{ hour: number; label: string; events: number }>;
}

export function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Vues aujourd'hui" 
          value={data.realtime.todayViews} 
          growth={data.realtime.viewsGrowth}
          icon="👁️"
          gradient="from-indigo-500 to-purple-500"
        />
        <MetricCard 
          title="Copies du code" 
          value={data.realtime.todayCopies} 
          growth={data.realtime.copiesGrowth}
          icon="📋"
          gradient="from-pink-500 to-rose-500"
        />
        <MetricCard 
          title="Téléchargements" 
          value={data.realtime.todayDownloads} 
          icon="📲"
          gradient="from-emerald-500 to-teal-500"
        />
        <MetricCard 
          title="Inscriptions" 
          value={data.realtime.todaySignups} 
          icon="🎯"
          gradient="from-amber-500 to-orange-500"
        />
      </div>

      {/* Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-glass rounded-2xl p-6 admin-chart-container">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Entonnoir de conversion</h3>
          <div className="space-y-4">
            {[
              { label: "Visiteurs", value: data.funnel.views, rate: 100, color: "bg-indigo-500" },
              { label: "Copies du code", value: data.funnel.copies, rate: data.funnel.copyRate, color: "bg-purple-500" },
              { label: "Téléchargements", value: data.funnel.downloads, rate: data.funnel.downloadRate, color: "bg-pink-500" },
              { label: "Inscriptions", value: data.funnel.signups, rate: data.funnel.signupRate, color: "bg-teal-500" },
            ].map((step, _i) => (
              <div key={_i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-300">{step.label}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{step.value} ({step.rate}%)</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${step.color} rounded-full transition-all`} style={{ width: `${step.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-glass rounded-2xl p-6 admin-chart-container">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Appareils</h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Mobile", value: data.devices.mobile },
                    { name: "Desktop", value: data.devices.desktop },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#ec4899" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Mobile {data.devices.mobilePercent}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Desktop {100 - data.devices.mobilePercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Activity */}
      <div className="admin-glass rounded-2xl p-6 admin-chart-container">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Activité (24 dernières heures)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.hourlyActivity}>
              <defs>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e2e",
                  border: "1px solid #6366f1",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Area type="monotone" dataKey="events" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorEvents)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Browsers */}
      <div className="admin-glass rounded-2xl p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Navigateurs</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.browsers.slice(0, 4).map((b) => (
            <div key={b.name} className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{b.count}</p>
              <p className="text-sm text-slate-500">{b.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, growth, icon, gradient }: { 
  title: string; 
  value: number; 
  growth?: number;
  icon: string;
  gradient: string;
}) {
  return (
    <div className="admin-glass admin-stat-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {growth !== undefined && (
          <span className={`admin-badge ${growth >= 0 ? "admin-badge-success" : "admin-badge-error"}`}>
            {growth >= 0 ? "+" : ""}{growth}%
          </span>
        )}
      </div>
      <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {value.toLocaleString("fr-FR")}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{title}</p>
    </div>
  );
}
