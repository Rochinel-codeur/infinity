"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  date: string;
  source: string;
  isActive: boolean;
  order: number;
}

export function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "", text: "", date: new Date().toISOString().split("T")[0], source: "WhatsApp"
  });
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const showAlert = (type: string, message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...formData, id: editingId } : formData;
      const res = await fetch("/api/admin/testimonials", {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      });
      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: "", text: "", date: new Date().toISOString().split("T")[0], source: "WhatsApp" });
        fetchTestimonials();
        showAlert("success", editingId ? "Témoignage modifié !" : "Témoignage ajouté !");
      }
    } catch (e) { showAlert("error", "Erreur lors de l'enregistrement"); }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch("/api/admin/testimonials", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !isActive })
      });
      fetchTestimonials();
      showAlert("success", isActive ? "Témoignage désactivé" : "Témoignage activé");
    } catch (e) { console.error(e); }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    try {
      await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      fetchTestimonials();
      showAlert("success", "Témoignage supprimé");
    } catch (e) { console.error(e); }
  };

  const startEdit = (t: Testimonial) => {
    setFormData({ name: t.name, text: t.text, date: t.date.split("T")[0], source: t.source });
    setEditingId(t.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          <span className="text-xl">{alert.type === "success" ? "✓" : "⚠"}</span>
          <p>{alert.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {testimonials.length} témoignages
          </h3>
          <p className="text-sm text-slate-500">{testimonials.filter(t => t.isActive).length} actifs</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: "", text: "", date: new Date().toISOString().split("T")[0], source: "WhatsApp" }); }} className="admin-btn-primary flex items-center gap-2">
          <span>{showForm ? "✕" : "+"}</span> {showForm ? "Annuler" : "Ajouter"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="admin-glass rounded-2xl p-6 space-y-4">
          <h4 className="font-semibold text-slate-900 dark:text-white">{editingId ? "Modifier" : "Nouveau"} témoignage</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" placeholder="Nom" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="admin-input" />
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="admin-input" />
            <select value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} className="admin-input">
              <option value="WhatsApp">WhatsApp</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Email">Email</option>
            </select>
          </div>
          <textarea placeholder="Témoignage..." value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} required rows={3} className="admin-input resize-none" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="admin-btn-secondary">Annuler</button>
            <button type="submit" className="admin-btn-primary">{editingId ? "Modifier" : "Ajouter"}</button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>
        ) : testimonials.length === 0 ? (
          <div className="admin-glass rounded-2xl p-12 text-center">
            <span className="text-4xl">💬</span>
            <p className="text-slate-500 mt-2">Aucun témoignage</p>
          </div>
        ) : (
          testimonials.map((t) => (
            <div key={t.id} className={`admin-glass rounded-2xl p-5 transition-opacity ${!t.isActive ? "opacity-50" : ""}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.source === "WhatsApp" ? "from-emerald-400 to-emerald-600" : t.source === "Facebook" ? "from-blue-400 to-blue-600" : "from-pink-400 to-pink-600"} flex items-center justify-center text-white font-bold`}>
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 dark:text-white">{t.name}</span>
                    <span className="text-xs text-slate-400">{format(new Date(t.date), "dd/MM/yyyy")}</span>
                    <span className={`admin-badge ${t.isActive ? "admin-badge-success" : "admin-badge-warning"}`}>{t.isActive ? "Actif" : "Inactif"}</span>
                    <span className="admin-badge admin-badge-info">{t.source}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">{t.text}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(t)} className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-500" title="Modifier">✏️</button>
                  <button onClick={() => toggleActive(t.id, t.isActive)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title={t.isActive ? "Désactiver" : "Activer"}>{t.isActive ? "👁️" : "👁️‍🗨️"}</button>
                  <button onClick={() => deleteTestimonial(t.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500" title="Supprimer">🗑️</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
