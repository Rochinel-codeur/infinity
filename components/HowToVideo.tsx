export function HowToVideo({
  videoSrc,
  poster,
  title = "Comment s'inscrire",
  hint = "Suis exactement ces étapes dans la vidéo."
}: {
  videoSrc: string;
  poster?: string;
  title?: string;
  hint?: string;
}) {
  return (
    <section
      aria-label="Comment s'inscrire"
      className="glass-card rounded-2xl p-5 shadow-soft sm:p-6 card-hover"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Tutoriel vidéo</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 mb-4">
        {hint}
      </p>

      {/* Video Container */}
      <div className="relative rounded-xl overflow-hidden shadow-lg group">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <video
          className="aspect-video w-full bg-zinc-900"
          controls
          playsInline
          preload="metadata"
          poster={poster}
          aria-label="Vidéo : comment s'inscrire"
        >
          <source src={videoSrc} type="video/mp4" />
          La vidéo ne se charge pas. Vérifie ta connexion ou réessaie plus tard.
        </video>
      </div>

      {/* Tips */}
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 rounded-full px-3 py-1.5">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Durée : 2 min</span>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 rounded-full px-3 py-1.5">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Étape par étape</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
        💡 Si la vidéo ne s'affiche pas, ouvre-la dans un autre navigateur ou réactualise la page.
      </p>
    </section>
  );
}
