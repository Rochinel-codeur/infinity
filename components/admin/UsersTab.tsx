"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";

interface User {
  id: string;
  email: string | null;
  phone: string | null;
  promoCode: string;
  source: string | null;
  device: string | null;
  browser: string | null;
  status: string;
  createdAt: string;
}

export function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/admin/export/users");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `utilisateurs_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      {/* ... existing header ... */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par email, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-12"
          />
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="admin-btn-primary flex items-center gap-2"
        >
          {isExporting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          Exporter CSV
        </button>
      </div>

      {/* Users Table */}
      <div className="admin-glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Code Promo</th>
                <th>Source</th>
                <th>Appareil</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="animate-spin w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">👥</span>
                      <p>Aucun utilisateur trouvé</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{user.email || "—"}</p>
                        {user.phone && <p className="text-xs text-slate-500">{user.phone}</p>}
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-sm px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                        {user.promoCode}
                      </span>
                    </td>
                    <td className="text-slate-500">{user.source || "—"}</td>
                    <td>
                      <span className="flex items-center gap-1 text-slate-500">
                        {user.device === "mobile" ? "📱" : "💻"} {user.device || "—"}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${
                        user.status === "active" ? "admin-badge-success" :
                        user.status === "verified" ? "admin-badge-info" : "admin-badge-warning"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-slate-500 text-sm">
                      {format(new Date(user.createdAt), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
            <p className="text-sm text-slate-500">Page {page} sur {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="admin-btn-secondary px-3 py-1.5 text-sm disabled:opacity-50"
              >
                ← Précédent
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="admin-btn-secondary px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Suivant →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
