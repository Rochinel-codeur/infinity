import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin - Tableau de bord",
  description: "Interface d'administration",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-[#0f0f23] dark:via-[#1a1a35] dark:to-[#0f0f23]">
      {children}
    </div>
  );
}
