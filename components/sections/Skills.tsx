"use client";

import type { SkillCategory } from "@/types";
import FadeIn from "@/components/animation/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Skills({
  skillCategories,
}: {
  skillCategories: SkillCategory[];
}) {
  return (
    <section id="skills" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading
          index="02"
          eyebrow="Skills & tech stack"
          title="The tools I use to ship full-stack products."
        />
        <div className="mt-16 grid gap-px bg-line md:grid-cols-3">
          {skillCategories.map((category) => (
            <FadeIn key={category._id} className="bg-ink p-8 md:p-10">
              <p className="text-[11px] tracking-[0.28em] text-accent uppercase">
                {category.index}
              </p>
              <h3 className="font-display mt-6 text-3xl">{category.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {category.description}
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {category.skills?.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-line px-3 py-1 text-[11px] tracking-[0.14em] text-paper uppercase"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
