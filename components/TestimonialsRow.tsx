import type { Testimonial } from "@/data/testimonials";
import { TestimonialCard } from "@/components/TestimonialCard";

export function TestimonialsRow({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <div className="flex snap-x snap-mandatory gap-3">
        {testimonials.map((t) => (
          <div key={t.id} className="w-[86%] shrink-0 snap-start sm:w-[360px]">
            <TestimonialCard testimonial={t} />
          </div>
        ))}
      </div>
    </div>
  );
}
