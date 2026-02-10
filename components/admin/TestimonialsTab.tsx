"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  date: string;
  source: string;
  rating?: number;
  imageUrl?: string | null;
  isActive: boolean;
  order: number;
}

// ... imports

export function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "active">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    text: string;
    date: string;
    source: string;
    imageUrl: string;
    rating: number;
    file: File | null;
  }>({
    name: "", text: "", date: new Date().toISOString().split("T")[0], source: "WhatsApp", imageUrl: "", rating: 5, file: null
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (e: unknown) { console.error("Error fetching testimonials", e); }
    finally { setIsLoading(false); }
  };

  const showAlert = (type: string, message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = new FormData();
      if (editingId) body.append("id", editingId);
      body.append("name", formData.name);
      body.append("text", formData.text);
      body.append("date", formData.date);
      body.append("source", formData.source);
      body.append("imageUrl", formData.imageUrl);
      body.append("rating", formData.rating.toString());
      if (formData.file) body.append("file", formData.file);

      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/admin/testimonials", {
        method, body
      });
      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: "", text: "", date: new Date().toISOString().split("T")[0], source: "WhatsApp", imageUrl: "", rating: 5, file: null });
        fetchTestimonials();
        showAlert("success", editingId ? "Capture modifiée !" : "Capture ajoutée !");
      }
    } catch (e: unknown) { console.error(e); showAlert("error", "Erreur lors de l'enregistrement"); }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch("/api/admin/testimonials", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !isActive })
      });
      fetchTestimonials();
      showAlert("success", isActive ? "Désactivé" : "Activé");
    } catch (e: unknown) { console.error("Error toggling active status", e); }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    try {
      await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      fetchTestimonials();
      showAlert("success", "Supprimé");
    } catch (e: unknown) { console.error("Error deleting testimonial", e); }
  };

  const startEdit = (t: Testimonial) => {
    setFormData({ name: t.name, text: t.text, date: t.date.split("T")[0], source: t.source, imageUrl: t.imageUrl || "", rating: t.rating || 5, file: null });
    setEditingId(t.id);
    setShowForm(true);
  };

  const filteredTestimonials = testimonials.filter(t => {
      if (filter === "pending") return !t.isActive;
      if (filter === "active") return t.isActive;
      return true;
  });

  return (
    <div className="space-y-6">
      {/* ... Alert ... */}

      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           {/* ... filters ... */}
           <div className="flex gap-2 mb-2">
              <button 
                  onClick={() => setFilter("all")} 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
              >
                  Tous ({testimonials.length})
              </button>
              <button 
                  onClick={() => setFilter("active")} 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === "active" ? "bg-green-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
              >
                  Actifs ({testimonials.filter(t => t.isActive).length})
              </button>
              <button 
                  onClick={() => setFilter("pending")} 
                  className={`relative px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === "pending" ? "bg-amber-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
              >
                  En attente ({testimonials.filter(t => !t.isActive).length})
                  {testimonials.filter(t => !t.isActive).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  )}
              </button>
           </div>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: "", text: "", date: new Date().toISOString().split("T")[0], source: "WhatsApp", imageUrl: "", rating: 5, file: null }); }} className="admin-btn-primary flex items-center gap-2">
          <span>{showForm ? "✕" : "+"}</span> {showForm ? "Annuler" : "Ajouter"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold mb-4">{editingId ? "Modifier le témoignage" : "Ajouter un nouveau témoignage"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nom" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="admin-input" />
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="admin-input" />
            <textarea placeholder="Témoignage" value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} className="admin-input md:col-span-2" rows={3}></textarea>
            
            <div className="md:col-span-2 space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Preuve (Image)</label>
                <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    <span className="flex-shrink-0 mx-2 text-xs text-slate-400 uppercase">ou via URL</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <input type="text" placeholder="https://..." value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="admin-input" />
            </div>
            <select value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} className="admin-input">
              <option value="WhatsApp">WhatsApp</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Email">Email</option>
              <option value="UserSubmission">Soumission Utilisateur</option>
            </select>
            <select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })} className="admin-input">
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="admin-btn-secondary">Annuler</button>
            <button type="submit" className="admin-btn-primary">{editingId ? "Sauvegarder" : "Ajouter"}</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="admin-glass rounded-2xl p-12 text-center">
            <span className="text-4xl">📭</span>
            <p className="text-slate-500 mt-2">Aucun élément dans cette catégorie</p>
          </div>
        ) : (
          filteredTestimonials.map((t) => (
             <div key={t.id} className={`admin-glass rounded-2xl p-5 border-l-4 ${!t.isActive ? "border-amber-500 bg-amber-500/5" : "border-green-500"}`}>
               {/* ... item content ... (same as before but using t) */}
              <div className="flex items-start gap-4">
                {t.imageUrl ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-white/10 group relative">
                        <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                        <a href={t.imageUrl} target="_blank" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">🔍</a>
                    </div>
                ) : (
                    <div className={`w-16 h-16 shrink-0 rounded-full bg-gradient-to-br ${t.source === "WhatsApp" ? "from-green-500 to-emerald-600" : t.source === "UserSubmission" ? "from-blue-500 to-indigo-600" : "from-purple-500 to-indigo-600"} flex items-center justify-center text-white font-bold shadow-lg shadow-black/20`}>
                        {t.name.charAt(0)}
                    </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 dark:text-white">{t.name}</span>
                    <span className="text-xs text-slate-400">{format(new Date(t.date), "dd/MM/yyyy")}</span>
                    <span className={`admin-badge ${t.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"}`}>{t.isActive ? "Publié" : "En attente"}</span>
                    <span className="admin-badge admin-badge-info">{t.source === "UserSubmission" ? "Utilisateur" : t.source}</span>
                    {t.rating && (
                        <span className="text-yellow-500 text-sm">
                            {"★".repeat(t.rating)}{"☆".repeat(5-t.rating)}
                        </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm line-clamp-2">{t.text}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(t)} className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-500" title="Modifier">✏️</button>
                  <button 
                      onClick={() => toggleActive(t.id, t.isActive)} 
                      className={`p-2 rounded-lg ${!t.isActive ? "bg-green-100 text-green-600 hover:bg-green-200" : "hover:bg-amber-100 text-amber-600"}`} 
                      title={t.isActive ? "Masquer" : "Valider et Publier"}
                  >
                      {t.isActive ? "🚫" : "✅"}
                  </button>
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
