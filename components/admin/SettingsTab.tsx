"use client";

import { useState, useEffect, useRef } from "react";
import { emitLiveSync } from "@/lib/liveSync";

interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function SettingsTab({ admin }: { admin: AdminPayload }) {
  const [promoCode, setPromoCode] = useState("BCC123");
  const [appliedCount, setAppliedCount] = useState("12000");
  const [isSaving, setIsSaving] = useState(false);
  const [memberAvatars, setMemberAvatars] = useState<string[]>([]);
  const [isUploadingMembers, setIsUploadingMembers] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  const memberFileInputRef = useRef<HTMLInputElement>(null);

  const showAlert = (type: string, message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  useEffect(() => {
    // Fetch initial promo code
    Promise.all([
      fetch("/api/admin/settings/promo").then((res) => res.json()),
      fetch("/api/admin/settings/member-avatars").then((res) => res.json()),
    ]).then(([promoData, avatarsData]) => {
      if (promoData.code) setPromoCode(promoData.code);
      if (Array.isArray(avatarsData.avatars)) setMemberAvatars(avatarsData.avatars);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode }),
      });
      
      if (res.ok) {
         emitLiveSync("settings:promo");
         showAlert("success", "Code promo mis à jour !");
      } else {
         throw new Error("Failed");
      }
    } catch(e: unknown) {
      console.error(e);
      showAlert("error", "Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportEvents = async () => {
    try {
      const res = await fetch("/api/admin/export/events");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `evenements_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        showAlert("success", "Export des événements téléchargé !");
      }
    } catch (e: unknown) {
      console.error(e);
      showAlert("error", "Erreur lors de l&apos;export");
    }
  };

  const handleUploadMemberAvatar = async (fileToUpload: File | null) => {
    if (!fileToUpload) {
      showAlert("error", "Ajoutez au moins une image");
      return;
    }
    setIsUploadingMembers(true);
    try {
      const body = new FormData();
      body.append("file", fileToUpload);

      const res = await fetch("/api/admin/settings/member-avatars", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'upload");
      }

      setMemberAvatars(Array.isArray(data.avatars) ? data.avatars : []);
      emitLiveSync("settings:member-avatars");
      showAlert("success", "Photos membres mises à jour");
    } catch (e: unknown) {
      console.error(e);
      showAlert("error", "Erreur lors de l'upload des photos");
    } finally {
      setIsUploadingMembers(false);
    }
  };

  const handlePickMemberFiles = () => {
    if (isUploadingMembers) return;
    memberFileInputRef.current?.click();
  };

  const handleMemberFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    await handleUploadMemberAvatar(file);
    e.target.value = "";
  };

  const handleRemoveMemberAvatar = async (index: number) => {
    try {
      const res = await fetch("/api/admin/settings/member-avatars", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }
      setMemberAvatars(Array.isArray(data.avatars) ? data.avatars : []);
      emitLiveSync("settings:member-avatars");
      showAlert("success", "Photo supprimée");
    } catch (e: unknown) {
      console.error(e);
      showAlert("error", "Suppression impossible");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Alert */}
      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          <span className="text-xl">{alert.type === "success" ? "✓" : "⚠"}</span>
          <p>{alert.message}</p>
        </div>
      )}

      <div className="admin-glass rounded-2xl p-5 border border-blue-200/40 dark:border-blue-900/40">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
          Pour ajouter les vraies photos des badges <strong>Membre</strong>, utilise ce raccourci.
        </p>
        <button
          type="button"
          onClick={() => {
            document.getElementById("member-avatars-settings")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="admin-btn-primary"
        >
          Aller aux photos membres
        </button>
      </div>

      {/* Admin Profile */}
      <div id="member-avatars-settings" className="admin-glass rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">{admin.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{admin.name}</h3>
            <p className="text-slate-500">{admin.email}</p>
            <span className="admin-badge admin-badge-info mt-1">{admin.role}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">ID Compte</p>
            <p className="font-mono text-sm text-slate-600 dark:text-slate-300 truncate">{admin.id}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Dernière connexion</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Maintenant</p>
          </div>
        </div>
      </div>

      {/* Site Settings */}
      <div className="admin-glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">⚙️</span>
          Paramètres du site
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Code promo affiché</label>
            <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="admin-input font-mono text-lg" />
            <p className="text-xs text-slate-400 mt-1">Ce code sera affiché sur la page principale</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre d&apos;utilisateurs affiché</label>
            <input type="text" value={appliedCount} onChange={(e) => setAppliedCount(e.target.value)} className="admin-input" />
            <p className="text-xs text-slate-400 mt-1">Affiché dans &quot;Déjà X personnes l&apos;ont appliquée&quot;</p>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="admin-btn-primary flex items-center gap-2">
            {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "💾"}
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      {/* Hero Members Badges */}
      <div className="admin-glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">👥</span>
          Photos des badges membres
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Ces 5 photos remplacent les avatars &quot;Membre&quot; en haut de la page. Le badge <strong>+15k</strong> reste inchangé.
        </p>

        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {Array.from({ length: 5 }).map((_, index) => {
            const avatar = memberAvatars[index];
            return (
              <button
                key={`member-avatar-${index}`}
                type="button"
                onClick={() => {
                  if (!avatar) return;
                  const shouldDelete = window.confirm("Supprimer cette photo du badge membre ?");
                  if (!shouldDelete) return;
                  handleRemoveMemberAvatar(index);
                }}
                className={`relative w-14 h-14 rounded-full border-2 border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 ${
                  avatar ? "cursor-pointer hover:scale-105 transition-transform" : "cursor-default"
                }`}
                title={avatar ? "Cliquer pour supprimer cette photo" : "Slot vide"}
              >
                {avatar ? (
                  <img src={avatar} alt={`Membre ${index + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">Vide</div>
                )}
                {avatar && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    ×
                  </span>
                )}
              </button>
            );
          })}
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center border-2 border-slate-300 dark:border-slate-700">
            +15k
          </div>
        </div>

        <div className="space-y-3">
          <input
            ref={memberFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleMemberFilesSelected}
            className="hidden"
          />
          <p className="text-xs text-slate-400">
            Ajout unitaire: choisissez une photo à la fois. Maximum 5 photos.
          </p>
          <button
            type="button"
            onClick={handlePickMemberFiles}
            disabled={isUploadingMembers}
            className="admin-btn-primary flex items-center gap-2"
          >
            {isUploadingMembers ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "🖼️"
            )}
            {isUploadingMembers ? "Upload..." : "Ajouter un membre au badge"}
          </button>
        </div>
      </div>

      {/* Export Section */}
      <div className="admin-glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">📊</span>
          Exports de données
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={handleExportEvents} className="admin-btn-secondary flex items-center justify-center gap-2 py-4">
            <span>📈</span> Exporter les événements (CSV)
          </button>
          <a href="/api/admin/export/users" className="admin-btn-secondary flex items-center justify-center gap-2 py-4">
            <span>👥</span> Exporter les utilisateurs (CSV)
          </a>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border-2 border-dashed border-red-200 dark:border-red-900/50 p-6 bg-red-50/50 dark:bg-red-900/10">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
          <span>⚠️</span> Zone dangereuse
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Ces actions sont irréversibles. Utilisez avec précaution.</p>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm">
            Réinitialiser les statistiques
          </button>
          <button className="px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm">
            Supprimer tous les utilisateurs
          </button>
        </div>
      </div>
    </div>
  );
}
