"use client";

import type { Profile } from "@/types";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/animation/Magnetic";
import SceneCanvas from "@/components/canvas/SceneCanvas";

export default function Hero({ profile }: { profile: Profile }) {
  return (
    <section
      id="top"
      className="relative flex min-h-svh items-end overflow-hidden px-5 pb-16 md:px-10 md:pb-20"
    >
      <SceneCanvas />
      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="text-[11px] tracking-[0.32em] text-accent uppercase">
            {profile.role} — {profile.location}
          </p>
          <h1 className="font-display mt-6 max-w-5xl text-5xl leading-[0.9] font-semibold text-balance md:text-8xl">
            {profile.tagline}
          </h1>
        </div>
        <div className="flex flex-col justify-end gap-8 md:col-span-4">
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            {profile.intro}
          </p>
          <p className="text-[11px] tracking-[0.18em] text-muted uppercase">
            {profile.availability}
          </p>
          <Magnetic>
            <Button href="#work">View projects</Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
