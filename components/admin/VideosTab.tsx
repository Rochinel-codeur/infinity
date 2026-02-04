"use client";

import { useState } from "react";

// Mock video data
const INITIAL_VIDEOS = [
  { id: "v1", title: "Tutoriel Principal", url: "/media/demo.mp4", active: true, uploadDate: "2026-02-01" },
  { id: "v2", title: "Témoignage Groupe A", url: "/media/temoignage1.mp4", active: false, uploadDate: "2026-01-28" },
];

export function VideosTab() {
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newVideo = {
        id: `v${Date.now()}`,
        title: "Nouvelle Vidéo (Mock)",
        url: "/media/demo.mp4", // Mock URL
        active: false,
        uploadDate: new Date().toISOString().split("T")[0],
      };
      setVideos([newVideo, ...videos]);
      setIsUploading(false);
      alert("Vidéo ajoutée avec succès (Simulation)");
    }, 1500);
  };

  const toggleActive = (id: string) => {
    setVideos(videos.map(v => v.id === id ? { ...v, active: !v.active } : v));
  };

  const deleteVideo = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / Upload Section */}
      <div className="admin-glass rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gestion des Vidéos</h2>
            <p className="text-sm text-slate-500">Ajoutez et gérez les vidéos visibles sur la page d'accueil</p>
          </div>
          <button 
            onClick={() => document.getElementById('upload-form')?.classList.toggle('hidden')}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle Vidéo
          </button>
        </div>

        {/* Upload Form (Hidden by default) */}
        <div id="upload-form" className="hidden mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Ajouter une vidéo</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titre</label>
              <input type="text" required className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 px-3 py-2" placeholder="Ex: Tutoriel Inscription" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fichier Vidéo (MP4)</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <p className="text-slate-500">Cliquez ou glissez une vidéo ici</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => document.getElementById('upload-form')?.classList.add('hidden')} className="px-3 py-1.5 text-slate-500 hover:text-slate-700">Annuler</button>
              <button type="submit" disabled={isUploading} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {isUploading ? "Chargement..." : "Uploader"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="admin-glass rounded-xl overflow-hidden group">
            <div className="aspect-video bg-black relative">
              <video src={video.url} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${video.active ? 'bg-green-500 text-white' : 'bg-slate-500 text-slate-200'}`}>
                   {video.active ? 'Actif' : 'Inactif'}
                 </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-900 dark:text-white truncate">{video.title}</h3>
              <p className="text-xs text-slate-500 mb-4">Ajouté le {video.uploadDate}</p>
              
              <div className="flex items-center justify-between gap-2">
                <button 
                  onClick={() => toggleActive(video.id)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border ${video.active ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-green-200 text-green-600 hover:bg-green-50'} transition-colors`}
                >
                  {video.active ? 'Désactiver' : 'Activer'}
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
        ))}
      </div>
    </div>
  );
}
