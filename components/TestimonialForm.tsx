"use client";

import { useState, useRef } from "react";
import { emitLiveSync } from "@/lib/liveSync";

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
      emitLiveSync("testimonials:submitted");
      e.currentTarget.reset();
    } catch (_err: unknown) {
      console.error(_err);
      setError((_err as Error).message || "Une erreur est survenue. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setError("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 min-[430px]:px-4 mb-10 sm:mb-12">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-blue-400 bg-zinc-900 p-4 min-[380px]:p-5 sm:p-6 text-center transition-all hover:border-blue-300 hover:bg-zinc-900/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
        >
          <span className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.22),transparent_65%)] group-hover:opacity-100" />
          <span className="relative text-3xl block mb-2 scale-110 transition-transform group-hover:scale-110">✍️</span>
          <h3 className="relative text-base min-[380px]:text-lg font-bold text-white">Partagez votre retour d&apos;experience</h3>
          <p className="relative mt-2 text-xs min-[380px]:text-sm font-semibold text-blue-300">Cliquez ici pour envoyer votre avis</p>
          <p className="relative text-zinc-400 text-sm mt-1">Chaque temoignage est verifie avant publication.</p>
        </button>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 min-[380px]:p-5 sm:p-6 animate-in fade-in slide-in-from-bottom-4 shadow-lg shadow-black/30">
          <div className="flex justify-between items-center mb-5 sm:mb-6 gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-white">Nouveau temoignage</h3>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
          </div>

          <div className="mb-5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-200">
            Remplissez ce formulaire en 30 secondes, puis cliquez sur <span className="font-semibold text-white">Envoyer</span>.
          </div>

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                ✓
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Merci !</h4>
              <p className="text-zinc-400">Votre temoignage a bien ete recu et sera publie apres validation.</p>
              
              <div className="flex flex-col min-[380px]:flex-row justify-center gap-2.5 min-[380px]:gap-3 mt-6">
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
              <div className="grid md:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Votre Prénom</label>
                  <input name="name" type="text" required className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="Ex: Jean P." />
                </div>
                <div>
                   <label className="block text-sm font-medium text-zinc-400 mb-1">Preuve (Capture d&apos;écran)</label>
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

              <div className="flex flex-col-reverse min-[430px]:flex-row justify-end gap-2.5 sm:gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Annuler</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 sm:px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
