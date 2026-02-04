export type TestimonialSource = "WhatsApp";

export type Testimonial = {
  id: string;
  name: string;
  date: string; // ISO-8601 (YYYY-MM-DD)
  text: string;
  source: TestimonialSource;
  imageUrl?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "wa-001",
    name: "Nadia M.",
    date: "2026-01-28",
    source: "WhatsApp",
    imageUrl: "/assets/testimonials/wa-001.jpg",
    text: "La vidéo explique bien les étapes. J’ai noté le code et pendant l’inscription ça m’a évité de chercher."
  },
  {
    id: "wa-002",
    name: "Lucas R.",
    date: "2026-01-26",
    source: "WhatsApp",
    imageUrl: "/assets/testimonials/wa-002.jpg",
    text: "Je suis revenu après la vidéo Facebook : le code est clair, et l’inscription est vraiment simple sur mobile."
  },
  {
    id: "wa-003",
    name: "Sarah K.",
    date: "2026-01-25",
    source: "WhatsApp",
    imageUrl: "/assets/testimonials/wa-003.jpg",
    text: "La vidéo m’a rassurée. J’ai copié le code et l’inscription s’est faite sans prise de tête."
  },
  {
    id: "wa-004",
    name: "Mehdi B.",
    date: "2026-01-23",
    source: "WhatsApp",
    imageUrl: "/assets/testimonials/wa-004.jpg",
    text: "J’ai suivi la vidéo pas à pas : le code s’applique direct à l’inscription, rien de compliqué."
  },
  {
    id: "wa-005",
    name: "Camille",
    date: "2026-01-22",
    source: "WhatsApp",
    imageUrl: "/assets/testimonials/wa-005.jpg",
    text: "Bonne surprise : la vidéo va à l’essentiel. Le code est copiable et l’inscription se fait en quelques champs."
  },
  {
    id: "wa-006",
    name: "Yanis",
    date: "2026-01-20",
    source: "WhatsApp",
    imageUrl: "/assets/testimonials/wa-006.jpg",
    text: "Après la vidéo, j’ai compris quand mettre le code : à l’inscription, c’est indiqué sans ambiguïté."
  },
  {
    id: "wa-007",
    name: "Inès",
    date: "2026-01-18",
    source: "WhatsApp",
    imageUrl: "/assets/testimonials/wa-007.jpg",
    text: "J’aime le côté carré : la vidéo montre le parcours, le code ne se perd pas, et l’inscription est rapide."
  },
  {
    id: "wa-008",
    name: "Romain",
    date: "2026-01-17",
    source: "WhatsApp",
    imageUrl: "/assets/testimonials/wa-008.jpg",
    text: "J’ai regardé la vidéo en entier, puis j’ai saisi le code au moment de l’inscription : nickel."
  },
  {
    id: "wa-009",
    name: "Aïcha",
    date: "2026-01-15",
    source: "WhatsApp",
    imageUrl: "/assets/testimonials/wa-009.jpg",
    text: "La vidéo est courte et utile. Le code se colle facilement et l’inscription se fait sans bug."
  },
  {
    id: "wa-010",
    name: "Tom",
    date: "2026-01-14",
    source: "WhatsApp",
    imageUrl: "/assets/testimonials/wa-010.jpg",
    text: "Je me repère vite : vidéo → code → inscription. C’est fluide et ça ne charge pas longtemps."
  },
  {
    id: "wa-011",
    name: "Léa",
    date: "2026-01-12",
    source: "WhatsApp",
    imageUrl: "/assets/testimonials/wa-011.jpg",
    text: "La vidéo donne le bon ordre. J’ai utilisé le code pendant l’inscription et tout a été validé du premier coup."
  },
  {
    id: "wa-012",
    name: "M.K.",
    date: "2026-01-10",
    source: "WhatsApp",
    imageUrl: "/assets/testimonials/wa-012.jpg",
    text: "J’ai juste suivi ce qui est montré en vidéo : copier le code, puis finir l’inscription. Simple et propre."
  }
];
