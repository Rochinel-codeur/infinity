"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
}

export function AdminHeader({ title, subtitle, onRefresh }: AdminHeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    
    // Check theme
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    await fetchNotifications();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleMarkAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
        await fetch(`/api/admin/notifications/${id}/read`, { method: "PUT" });
    } catch (e) { console.error(e); }
  };

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-[#1e1e2e]/80 backdrop-blur-xl border-b border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="lg:ml-0 ml-12">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {subtitle || format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Visit Site Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          title="Voir le site"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="text-sm">Site</span>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          title={isDark ? "Mode clair" : "Mode sombre"}
        >
          {isDark ? (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-[#1e1e2e] rounded-2xl shadow-2xl border border-indigo-100 dark:border-indigo-900/50 z-50">
              <div className="p-4 border-b border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between sticky top-0 bg-white dark:bg-[#1e1e2e]">
                <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full">
                    {unreadCount} nouvelles
                  </span>
                )}
              </div>
              <div className="p-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <span className="text-3xl">🔕</span>
                    <p className="text-sm text-slate-500 mt-2">Aucune notification</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.slice(0, 10).map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => !n.read && handleMarkAsRead(n.id)}
                        className={`p-3 rounded-xl transition-colors cursor-pointer relative ${n.read ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-70' : 'bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-medium'}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            n.type === "success" ? "bg-emerald-100 dark:bg-emerald-900/30" : 
                            n.type === "warning" ? "bg-amber-100 dark:bg-amber-900/30" : 
                            n.type === "error" ? "bg-red-100 dark:bg-red-900/30" : 
                            "bg-indigo-100 dark:bg-indigo-900/30"
                          }`}>
                            {n.type === "success" ? "✓" : n.type === "warning" ? "⚠" : n.type === "error" ? "✕" : "ℹ"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <p className={`text-sm ${n.read ? 'text-slate-900 dark:text-white' : 'text-indigo-900 dark:text-indigo-100 font-bold'}`}>{n.title}</p>
                                {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                            </div>
                            <p className="text-xs text-slate-500 truncate">{n.message}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {format(new Date(n.time), "HH:mm", { locale: fr })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Refresh */}
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all ${isRefreshing ? "opacity-75" : ""}`}
          >
            <svg className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">{isRefreshing ? "..." : "Actualiser"}</span>
          </button>
        )}
      </div>
    </header>
  );
}
