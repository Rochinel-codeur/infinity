"use client";

import { useState, useRef } from "react";

export function TestimonialForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [rating, setRating] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("rating", rating.toString());
      
      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setIsSuccess(true);
      e.currentTarget.reset();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setError("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-12">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 border-dashed rounded-xl p-6 text-center transition-all group"
        >
          <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">✍️</span>
          <h3 className="text-lg font-bold text-white">Ajouter votre témoignage</h3>
          <p className="text-zinc-400 text-sm mt-1">Gagné grâce à la méthode ? Partagez votre expérience !</p>
        </button>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Nouveau témoignage</h3>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
          </div>

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                ✓
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Merci !</h4>
              <p className="text-zinc-400">Votre témoignage a été reçu et sera publié après validation.</p>
              
              <div className="flex justify-center gap-3 mt-6">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                    Fermer
                </button>
                <button onClick={handleReset} className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors">
                    Envoyer un autre
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Votre Prénom</label>
                  <input name="name" type="text" required className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="Ex: Jean P." />
                </div>
                <div>
                   <label className="block text-sm font-medium text-zinc-400 mb-1">Preuve (Capture d'écran)</label>
                   <input 
                     ref={fileInputRef}
                     name="image" 
                     type="file" 
                     accept="image/*"
                     className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-1.5 text-zinc-400 text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" 
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Votre Note</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-zinc-700"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Votre message</label>
                <textarea name="text" required rows={3} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="Racontez votre expérience..."></textarea>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Annuler</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi...
                    </>
                  ) : "Envoyer"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
