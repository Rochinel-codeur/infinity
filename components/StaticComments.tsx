interface CommentItem {
  id: string;
  name: string;
  text: string;
  date: string | Date;
  rating?: number;
}

function toRelativeDateLabel(value: string | Date) {
  const date = new Date(value);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) {
    return "Recemment";
  }

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "A l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes}min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays <= 30) return `Il y a ${diffDays}j`;

  return date.toLocaleDateString("fr-FR");
}

function normalizeRating(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return 5;
  return Math.min(5, Math.max(1, Math.round(value)));
}

export function VerificationComments({ comments = [] }: { comments?: CommentItem[] }) {
  const dynamicComments = comments.slice(0, 12).map((comment) => ({
    id: comment.id,
    name: comment.name,
    timeLabel: toRelativeDateLabel(comment.date),
    text: comment.text,
    stars: normalizeRating(comment.rating),
  }));

  if (dynamicComments.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-3 min-[430px]:px-4 py-6 sm:py-8">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Commentaires Recents</h3>
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 text-sm text-zinc-400">
          Aucun commentaire valide pour le moment.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 min-[430px]:px-4 py-6 sm:py-8">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
        <h3 className="text-lg sm:text-xl font-bold text-white">Commentaires Recents</h3>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dynamicComments.map((comment) => (
          <div key={comment.id} className="bg-zinc-900/50 border border-white/5 rounded-xl p-3.5 sm:p-4 hover:bg-zinc-900 transition-colors">
            <div className="flex items-start justify-between mb-2 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center font-bold text-blue-300 shrink-0">
                  {comment.name.charAt(0)}
                </div>
                <h4 className="font-bold text-[13px] sm:text-sm text-zinc-200 truncate">{comment.name}</h4>
              </div>
              <span className="text-[11px] sm:text-xs text-zinc-500 shrink-0 whitespace-nowrap">{comment.timeLabel}</span>
            </div>

            <div className="flex text-yellow-500 text-xs mb-2">
              {[...Array(5)].map((_, starIndex) => (
                <span key={`${comment.id}-${starIndex}`}>{starIndex < comment.stars ? "★" : "☆"}</span>
              ))}
            </div>

            <p className="text-[13px] sm:text-sm text-zinc-400 leading-relaxed">&quot;{comment.text}&quot;</p>
          </div>
        ))}
      </div>
    </div>
  );
}
