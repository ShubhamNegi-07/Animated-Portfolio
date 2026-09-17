"use client";

import type { Testimonial } from "@/types";
import FadeIn from "@/components/animation/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <section className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading
          index="04"
          eyebrow="References"
          title="Engineers and leads I've shipped with."
        />
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {testimonials.map((item) => (
            <FadeIn key={item._id}>
              <blockquote className="border-t border-line pt-8">
                <p className="text-lg leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-8 text-sm text-muted">
                  <p className="text-paper">{item.author}</p>
                  <p>
                    {item.role}, {item.company}
                  </p>
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
