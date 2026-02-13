"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { emitLiveSync, subscribeLiveSync } from "@/lib/liveSync";

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string | null;
  isActive: boolean;
  isTutorial: boolean;
  createdAt: string;
}

export function VideosTab() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    url: string;
    thumbnailUrl: string;
    isTutorial: boolean;
    file: File | null;
    thumbnailFile: File | null;
  }>({
    title: "",
    url: "",
    thumbnailUrl: "",
    isTutorial: false,
    file: null,
    thumbnailFile: null
  });
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    fetchVideos();
    const unsubscribe = subscribeLiveSync((topic) => {
      if (topic.startsWith("videos:") || topic.startsWith("testimonials:")) {
        fetchVideos();
      }
    });
    const interval = window.setInterval(fetchVideos, 15000);
    return () => {
      unsubscribe();
      window.clearInterval(interval);
    };
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/admin/videos");
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos || []);
      }
    } catch (e: unknown) { console.error("Error fetching videos", e); }
    finally { setIsLoading(false); }
  };

  const showAlert = (type: string, message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      const body = new FormData();
      body.append("title", formData.title);
      body.append("url", formData.url);
      body.append("thumbnailUrl", formData.thumbnailUrl);
      body.append("isTutorial", String(formData.isTutorial));
      if (formData.file) body.append("file", formData.file);
      if (formData.thumbnailFile) body.append("thumbnailFile", formData.thumbnailFile);

      const res = await fetch("/api/admin/videos", {
        method: "POST",
        body
      });

      if (res.ok) {
        setFormData({ title: "", url: "", thumbnailUrl: "", isTutorial: false, file: null, thumbnailFile: null });
        setShowForm(false);
        fetchVideos();
        emitLiveSync("videos:changed");
        showAlert("success", formData.isTutorial ? "Vidéo badge téléphone enregistrée" : "Vidéo ajoutée avec succès");
      } else {
        showAlert("error", "Erreur lors de l'ajout");
      }
    } catch (e: unknown) {
      console.error(e);
      showAlert("error", "Erreur serveur");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch("/api/admin/videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !isActive })
      });
      fetchVideos();
      emitLiveSync("videos:changed");
      showAlert("success", isActive ? "Vidéo désactivée" : "Vidéo activée");
    } catch (e: unknown) { console.error("Error toggling active status", e); }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) return;
    try {
      await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" });
      fetchVideos();
      emitLiveSync("videos:changed");
      showAlert("success", "Vidéo supprimée");
    } catch (e: unknown) { console.error("Error deleting video", e); }
  };

  const toggleTutorial = async (id: string, isTutorial: boolean) => {
    try {
      await fetch("/api/admin/videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isTutorial: !isTutorial }),
      });
      fetchVideos();
      emitLiveSync("videos:changed");
      showAlert("success", !isTutorial ? "Badge téléphone activé" : "Badge téléphone retiré");
    } catch (e: unknown) {
      console.error("Error toggling tutorial video", e);
      showAlert("error", "Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <div className={`p-4 rounded-xl mb-4 text-white font-medium flex items-center gap-2 ${alert.type === "success" ? "bg-green-500/80" : "bg-red-500/80"}`}>
          <span>{alert.type === "success" ? "✓" : "⚠"}</span>
          <p>{alert.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="admin-glass rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gestion des Vidéos</h2>
            <p className="text-sm text-slate-500">Ajoutez et gérez les vidéos visibles sur la page d&apos;accueil</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            <span>{showForm ? "✕" : "+"}</span> {showForm ? "Annuler" : "Nouvelle Vidéo"}
          </button>
        </div>

        {/* Upload Form */}
        {showForm && (
          <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Ajouter une vidéo</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titre</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 px-3 py-2" 
                  placeholder="Ex: Tutoriel Inscription" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Fichier Vidéo</label>
                  <input 
                      type="file" 
                      accept="video/*" 
                      onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})} 
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-200" 
                  />
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    <span className="flex-shrink-0 mx-2 text-xs text-slate-400 uppercase">ou URL</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <input 
                    type="url" 
                    value={formData.url}
                    onChange={e => setFormData({...formData, url: e.target.value})}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 px-3 py-2" 
                    placeholder="https://... (YouTube, Facebook, Instagram, TikTok, Vimeo...)" 
                  />
                  <p className="text-xs text-slate-500">
                    Les liens sociaux sont pris en charge en plus des fichiers uploadés.
                  </p>
                </div>
                
                <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Miniature (Image)</label>
                  <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setFormData({...formData, thumbnailFile: e.target.files?.[0] || null})} 
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-200" 
                  />
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    <span className="flex-shrink-0 mx-2 text-xs text-slate-400 uppercase">ou URL Image</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <input 
                    type="url" 
                    value={formData.thumbnailUrl}
                    onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 px-3 py-2" 
                    placeholder="https://..." 
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-blue-200/50 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-900/20 px-3 py-2">
                <input
                  id="video-tutorial"
                  type="checkbox"
                  checked={formData.isTutorial}
                  onChange={(e) => setFormData({ ...formData, isTutorial: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="video-tutorial" className="text-sm text-slate-700 dark:text-slate-200">
                  Afficher dans le téléphone des étapes (badge téléphone)
                </label>
              </div>
              <p className="text-xs text-slate-500 -mt-2">
                Une seule vidéo peut porter ce badge: elle s&apos;affichera dans le téléphone à côté des étapes.
              </p>
              <div className="flex justify-end gap-2 text-sm">
                <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 text-slate-500 hover:text-slate-700">Annuler</button>
                <button type="submit" disabled={isUploading} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {isUploading ? "Enregistrement..." : "Ajouter la vidéo"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
           <div className="col-span-full flex justify-center py-12"><div className="animate-spin w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>
        ) : videos.length === 0 ? (
           <div className="col-span-full text-center py-12 text-slate-500">Aucune vidéo</div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className={`admin-glass rounded-xl overflow-hidden group ${!video.isActive ? 'opacity-60' : ''}`}>
              <div className="aspect-video bg-black relative">
                <video src={video.url} className="w-full h-full object-cover opacity-80" poster={video.thumbnailUrl || undefined} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${video.isActive ? 'bg-blue-500 text-white' : 'bg-slate-500 text-slate-200'}`}>
                     {video.isActive ? 'Actif' : 'Inactif'}
                   </span>
                   {video.isTutorial && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500 text-white">
                      Badge téléphone
                    </span>
                   )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 dark:text-white truncate">{video.title}</h3>
                <p className="text-xs text-slate-500 mb-4">Ajouté le {format(new Date(video.createdAt), "dd/MM/yyyy")}</p>
                
                <div className="flex items-center justify-between gap-2">
                  <button 
                    onClick={() => toggleActive(video.id, video.isActive)}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border ${video.isActive ? 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20' : 'border-blue-200 text-blue-600 hover:bg-blue-50'} transition-colors`}
                  >
                    {video.isActive ? 'Masquer' : 'Afficher'}
                  </button>
                  <button
                    onClick={() => toggleTutorial(video.id, video.isTutorial)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      video.isTutorial
                        ? "border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-slate-300 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900/30"
                    }`}
                  >
                    {video.isTutorial ? "Badge téléphone ✓" : "Mettre en badge"}
                  </button>
                  <button 
                    onClick={() => deleteVideo(video.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
