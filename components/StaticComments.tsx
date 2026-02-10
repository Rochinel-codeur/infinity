"use client";

const COMMENTS = [
  {
    name: "Thomas D.",
    role: "Membre VIP",
    time: "Il y a 2h",
    text: "Je suivais plusieurs pronostiqueurs avant mais Coach Pronos est le seul qui montre ses tickets perdants aussi. Transparence totale, j'adore.",
    stars: 5,
  },
  {
    name: "Alexandre M.",
    role: "Inscrit depuis 1 semaine",
    time: "Il y a 5h",
    text: "L'application 1xBet est super fluide avec votre méthode. J'ai rentabilisé mon premier dépôt en 2 jours.",
    stars: 5,
  },
  {
    name: "Karim Z.",
    role: "Membre VIP",
    time: "Il y a 1j",
    text: "Le service client est réactif. J'avais un souci avec le code promo mais ils m'ont aidé en 5 minutes. Top !",
    stars: 4,
  },
  {
    name: "Sophie L.",
    role: "Nouveau membre",
    time: "Il y a 2j",
    text: "Enfin une vraie communauté. Les astuces sont claires et ça marche vraiment.",
    stars: 5,
  }
];

export function VerificationComments() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
        <h3 className="text-xl font-bold text-white">Commentaires Récents</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {COMMENTS.map((comment, i) => (
          <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 hover:bg-zinc-900 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                  {comment.name.charAt(0)}
                </div>
                <div>
                   <h4 className="font-bold text-sm text-zinc-200">{comment.name}</h4>
                   <p className="text-xs text-blue-400">{comment.role}</p>
                </div>
              </div>
              <span className="text-xs text-zinc-500">{comment.time}</span>
            </div>
            
            <div className="flex text-yellow-500 text-xs mb-2">
              {[...Array(5)].map((_, starIndex) => (
                <span key={starIndex}>{starIndex < comment.stars ? "★" : "☆"}</span>
              ))}
            </div>
            
            <p className="text-sm text-zinc-400 leading-relaxed">
              &quot;{comment.text}&quot;
            </p>
          </div>
        ))}
      </div>
      

    </div>
  );
}
