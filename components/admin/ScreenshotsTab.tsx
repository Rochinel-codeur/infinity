"use client";

import { useState, useEffect } from "react";
import { WhatsAppScreenshot } from "@/components/WhatsAppScreenshot";

interface Screenshot {
  id: string;
  name: string;
  message: string;
  amount: string;
  time: string;
  type: string;
  imageUrl?: string | null;
  isActive: boolean;
}

export function ScreenshotsTab() {
  const [items, setItems] = useState<Screenshot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "Joueur",
    message: "Validé avec succès ! ✅",
    amount: "500,000 XAF",
    time: "12:00",
    type: "win",
    imageUrl: "",
    file: null as File | null
  });
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/screenshots");
      if (res.ok) {
        const data = await res.json();
        setItems(data.screenshots || []);
      }
    } catch (e) { console.error(e); }
  };

  const showAlert = (type: string, message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = new FormData();
      if (editingId) body.append("id", editingId);
      body.append("name", formData.name);
      body.append("message", formData.message);
      body.append("amount", formData.amount);
      body.append("time", formData.time);
      body.append("type", formData.type);
      if (formData.imageUrl) body.append("imageUrl", formData.imageUrl);
      body.append("isActive", "true");
      if (formData.file) body.append("file", formData.file);

      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/admin/screenshots", { method, body });
      
      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: "Joueur", message: "Validé avec succès ! ✅", amount: "500,000 XAF", time: "12:00", type: "win", imageUrl: "", file: null });
        fetchItems();
        showAlert("success", "Capture enregistrée !");
      }
    } catch (e) { showAlert("error", "Erreur d'enregistrement"); }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch("/api/admin/screenshots", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !isActive })
      });
      fetchItems();
    } catch (e) { console.error(e); }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Supprimer cette capture ?")) return;
    try {
      await fetch(`/api/admin/screenshots?id=${id}`, { method: "DELETE" });
      fetchItems();
    } catch (e) { console.error(e); }
  };

  const startEdit = (item: Screenshot) => {
    setFormData({
      name: item.name,
      message: item.message,
      amount: item.amount,
      time: item.time,
      type: item.type,
      imageUrl: item.imageUrl || "",
      file: null
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Captures WhatsApp (Marquee)</h2>
           <p className="text-zinc-400 text-sm">Gérez les preuves qui défilent en haut du site pour la crédibilité.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); }} className="admin-btn-primary flex items-center gap-2">
          <span>{showForm ? "✕" : "+"}</span> {showForm ? "Fermer" : "Nouvelle Capture"}
        </button>
      </div>

      {alert && (
        <div className={`p-4 rounded-xl text-center font-medium ${alert.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
          {alert.message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-glass p-8 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <h3 className="text-xl font-bold mb-6 text-white">{editingId ? "Modifier la Capture" : "Ajouter une Preuve"}</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-zinc-400 mb-1 block">Titre / Nom du Joueur</label>
                        <input className="admin-input" placeholder="Ex: Marc, Coach Pronos..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-zinc-400 mb-1 block">Montant du Gain</label>
                        <input className="admin-input" placeholder="Ex: 1,500,000 XAF" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-zinc-400 mb-1 block">Heure</label>
                            <input className="admin-input" placeholder="Ex: 12:00" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-zinc-400 mb-1 block">Type</label>
                            <select className="admin-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                <option value="win">Gain (Win)</option>
                                <option value="thanks">Remerciement</option>
                            </select>
                        </div>
                    </div>
                    <div>
                         <label className="text-sm font-medium text-zinc-400 mb-1 block">Message Chat</label>
                         <textarea className="admin-input" rows={2} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                    </div>
                </div>

                <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                    <label className="block text-sm font-medium text-indigo-300 mb-2">Preuve Visuelle (Image du Ticket)</label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/10 transition-all">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                <p className="text-sm text-zinc-400">Cliquez pour uploader</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})} />
                        </label>
                    </div>
                    {formData.file && <p className="text-xs text-green-400 text-center">Fichier sélectionné : {formData.file.name}</p>}
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="admin-btn-secondary">Annuler</button>
                <button type="submit" className="admin-btn-primary px-8">Enregistrer</button>
            </div>
        </form>
      )}

      {/* Visual Grid Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map(item => (
            <div key={item.id} className="relative group flex justify-center">
                 {/* The Actual Component Preview */}
                 <div className={`transform transition-all duration-300 ${!item.isActive ? "opacity-50 grayscale" : "hover:scale-105"}`}>
                     <WhatsAppScreenshot 
                         name={item.name}
                         message={item.message}
                         amount={item.amount}
                         time={item.time}
                         imageUrl={item.imageUrl}
                         type={item.type as any}
                     />
                 </div>

                 {/* Hover Actions Overlay */}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 rounded-2xl backdrop-blur-sm z-50">
                     <span className="text-white font-bold mb-2">{item.isActive ? "En ligne" : "Masqué"}</span>
                     <div className="flex gap-2">
                        <button 
                            onClick={() => toggleActive(item.id, item.isActive)} 
                            className={`p-3 rounded-full ${item.isActive ? "bg-red-500/20 text-red-500 hover:bg-red-500" : "bg-green-500/20 text-green-500 hover:bg-green-500"} hover:text-white transition-all`}
                            title={item.isActive ? "Masquer" : "Publier"}
                        >
                            {item.isActive ? "🚫" : "✅"}
                        </button>
                        <button onClick={() => startEdit(item)} className="p-3 rounded-full bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all">✏️</button>
                        <button onClick={() => deleteItem(item.id)} className="p-3 rounded-full bg-zinc-800 text-zinc-400 hover:bg-red-600 hover:text-white transition-all">🗑️</button>
                     </div>
                 </div>
            </div>
        ))}
      </div>
      
      {items.length === 0 && !showForm && (
          <div className="text-center py-20 opacity-50">
              <p className="text-xl">Aucune capture pour le moment.</p>
              <p className="text-sm mt-2">Ajoutez-en une pour voir le résultat.</p>
          </div>
      )}
    </div>
  );
}
