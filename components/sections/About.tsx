"use client";

import Image from "next/image";
import type { Profile } from "@/types";
import FadeIn from "@/components/animation/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";

export default function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <FadeIn>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src={profile.portrait}
                alt={profile.name}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
          </FadeIn>
        </div>
        <div className="flex flex-col justify-center md:col-span-7">
          <SectionHeading
            index="01"
            eyebrow="About"
            title={profile.name}
          />
          <FadeIn className="mt-8">
            <p className="max-w-2xl text-lg leading-relaxed text-pretty md:text-2xl">
              {profile.bio}
            </p>
            {profile.highlights?.length ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {profile.highlights.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line px-4 py-2 text-[11px] tracking-[0.18em] text-paper uppercase"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-8 text-sm tracking-[0.18em] text-muted uppercase">
              {profile.email}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
