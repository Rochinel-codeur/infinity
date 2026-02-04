import type { Testimonial } from "@/data/testimonials";
import Image from "next/image";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(d);
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const dateLabel = formatDate(testimonial.date);
  const avatarAlt = testimonial.imageUrl
    ? `Photo WhatsApp de ${testimonial.name}`
    : `Avatar de ${testimonial.name}`;

  return (
    <article className="h-full rounded-2xl border border-black/10 bg-gradient-to-b from-black/5 to-black/2 p-4 shadow-soft dark:border-white/10 dark:from-white/8 dark:to-white/3 sm:p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {testimonial.imageUrl ? (
            <Image
              src={testimonial.imageUrl}
              alt={avatarAlt}
              width={40}
              height={40}
              sizes="40px"
              className="h-10 w-10 shrink-0 rounded-full border border-black/10 object-cover dark:border-white/10"
            />
          ) : (
            <div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-600/10 text-sm font-bold text-emerald-800 ring-1 ring-emerald-600/15 dark:bg-emerald-400/15 dark:text-emerald-100 dark:ring-emerald-400/15"
              aria-label={avatarAlt}
            >
              {initials(testimonial.name)}
            </div>
          )}

          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">{testimonial.name}</p>
            <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">
              <time dateTime={testimonial.date}>{dateLabel}</time>
            </p>
          </div>
        </div>

        <p className="shrink-0 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100">
          {testimonial.source}
        </p>
      </header>

      <p className="mt-3 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">{testimonial.text}</p>
    </article>
  );
}
