export function VideoCard({ src, poster }: { src: string; poster?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-soft">
      <video
        className="aspect-video w-full"
        controls
        playsInline
        preload="metadata"
        poster={poster}
        aria-label="Vidéo de démonstration"
      >
        <source src={src} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
  );
}

