import prisma from "@/lib/prisma";

type DefaultTextTestimonial = {
  name: string;
  text: string;
  rating: number;
  hoursAgo: number;
};

const DEFAULT_TEXT_TESTIMONIALS: DefaultTextTestimonial[] = [
  {
    name: "Thomas D.",
    text: "Je suivais plusieurs pronostiqueurs avant mais Coach Pronos est le seul qui montre ses tickets perdants aussi. Transparence totale, j'adore.",
    rating: 5,
    hoursAgo: 2,
  },
  {
    name: "Alexandre M.",
    text: "L'application 1xBet est super fluide avec votre méthode. J'ai rentabilisé mon premier dépôt en 2 jours.",
    rating: 5,
    hoursAgo: 5,
  },
  {
    name: "Karim Z.",
    text: "Le service client est réactif. J'avais un souci avec le code promo mais ils m'ont aidé en 5 minutes. Top !",
    rating: 4,
    hoursAgo: 24,
  },
  {
    name: "Sophie L.",
    text: "Enfin une vraie communauté. Les astuces sont claires et ça marche vraiment.",
    rating: 5,
    hoursAgo: 48,
  },
  {
    name: "Nadine K.",
    text: "Je débute seulement et le parcours est facile à suivre, même sans expérience.",
    rating: 5,
    hoursAgo: 52,
  },
  {
    name: "Patrick E.",
    text: "Les explications sont nettes et les étapes d'inscription sont très bien détaillées.",
    rating: 4,
    hoursAgo: 72,
  },
  {
    name: "Mariam T.",
    text: "J'apprécie surtout la rapidité des mises à jour et la clarté des conseils.",
    rating: 5,
    hoursAgo: 96,
  },
  {
    name: "Junior B.",
    text: "Le système est propre, j'ai pu me lancer rapidement sans me perdre.",
    rating: 4,
    hoursAgo: 102,
  },
  {
    name: "Clara N.",
    text: "Très bon accompagnement, interface simple et retours utiles au quotidien.",
    rating: 5,
    hoursAgo: 120,
  },
];

const DEFAULT_TESTIMONIALS_SEEDED_KEY = "defaultTextTestimonialsSeeded";

function testimonialKey(name: string, text: string) {
  return `${name.trim().toLowerCase()}::${text.trim().toLowerCase()}`;
}

export async function ensureDefaultTextTestimonials() {
  const seedSetting = await prisma.setting.findUnique({
    where: { key: DEFAULT_TESTIMONIALS_SEEDED_KEY },
  });

  if (seedSetting?.value === "1") return;

  const totalTestimonials = await prisma.testimonial.count();

  if (totalTestimonials > 0) {
    await prisma.setting.upsert({
      where: { key: DEFAULT_TESTIMONIALS_SEEDED_KEY },
      update: { value: "1" },
      create: { key: DEFAULT_TESTIMONIALS_SEEDED_KEY, value: "1" },
    });
    return;
  }

  const existing = await prisma.testimonial.findMany({
    where: { imageUrl: null },
    select: { name: true, text: true },
  });

  const existingKeys = new Set(existing.map((item) => testimonialKey(item.name, item.text)));
  const missing = DEFAULT_TEXT_TESTIMONIALS.filter(
    (item) => !existingKeys.has(testimonialKey(item.name, item.text))
  );

  if (missing.length > 0) {
    const maxOrder = await prisma.testimonial.aggregate({
      _max: { order: true },
    });

    const baseOrder = (maxOrder._max.order ?? 0) + 1;
    const now = Date.now();

    await prisma.testimonial.createMany({
      data: missing.map((item, index) => ({
        name: item.name,
        text: item.text,
        source: "WhatsApp",
        rating: item.rating,
        date: new Date(now - item.hoursAgo * 60 * 60 * 1000),
        imageUrl: null,
        isActive: true,
        order: baseOrder + index,
      })),
    });
  }

  await prisma.setting.upsert({
    where: { key: DEFAULT_TESTIMONIALS_SEEDED_KEY },
    update: { value: "1" },
    create: { key: DEFAULT_TESTIMONIALS_SEEDED_KEY, value: "1" },
  });
}
