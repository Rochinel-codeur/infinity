"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}


type TabType = "overview" | "analytics" | "users" | "screenshots" | "testimonials" | "videos" | "push" | "settings";

interface AdminSidebarProps {
  admin: AdminPayload;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const tabs = [
  { id: "overview" as const, label: "Vue d'ensemble", icon: "📊" },
  { id: "analytics" as const, label: "Analytics", icon: "📈" },
  { id: "users" as const, label: "Utilisateurs", icon: "👥" },
  { id: "screenshots" as const, label: "Captures (Marquee)", icon: "🖼️" },
  { id: "testimonials" as const, label: "Avis (Détails)", icon: "💬" },
  { id: "videos" as const, label: "Vidéos", icon: "🎬" },
  { id: "push" as const, label: "Notifications", icon: "🔔" },
  { id: "settings" as const, label: "Paramètres / Photos", icon: "⚙️" },
];

export function AdminSidebar({ admin, activeTab, onTabChange, isOpen, onClose }: AdminSidebarProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[86vw] max-w-72 flex flex-col
        bg-gradient-to-b from-indigo-950 via-indigo-900 to-purple-950
        transform transition-all duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo - Fixed at top */}
        <div className="flex-shrink-0 h-20 flex items-center gap-3 px-6 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white text-lg">Admin Pro</p>
            <p className="text-xs text-indigo-200">Tableau de bord</p>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Navigation */}
          <div>
            <p className="px-4 py-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">Navigation</p>
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                    ${activeTab === tab.id
                      ? "bg-white/15 text-white font-medium shadow-lg shadow-indigo-500/20"
                      : "text-indigo-200 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions rapides */}
          <div>
            <p className="px-4 py-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">Actions rapides</p>
            <div className="space-y-1">
              {/* Visit Site */}
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-200 hover:bg-white/5 hover:text-white transition-all"
              >
                <span className="text-xl">🌐</span>
                <span>Voir le site</span>
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-200 hover:bg-white/5 hover:text-white transition-all"
              >
                <span className="text-xl">{isDark ? "☀️" : "🌙"}</span>
                <span>{isDark ? "Mode clair" : "Mode sombre"}</span>
                <div className={`ml-auto w-10 h-5 rounded-full transition-colors ${isDark ? "bg-indigo-500" : "bg-slate-600"} relative`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isDark ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* User Info - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">
                {admin.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{admin.name}</p>
              <p className="text-xs text-indigo-200 truncate">{admin.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
