"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Profile } from "@/types";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/animation/Magnetic";
import { gsap, useGSAP } from "@/lib/gsap-client";

type HeroProps = {
  profile: Profile;
};

type DisplayName = {
  firstName: string;
  lastName: string;
};

const TAGLINE =
  "Building scalable web apps, high-performance backends, and immersive digital experiences with intention, clarity and care.";

const NAME_LINE =
  "block w-full font-display text-[clamp(4.5rem,18.5vw,19rem)] font-bold uppercase leading-[0.78] tracking-[-0.07em] whitespace-nowrap";

const NAME_SOLID = `${NAME_LINE} text-paper`;

const NAME_OUTLINE = `${NAME_LINE} -mt-[0.06em] text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)] md:[-webkit-text-stroke-width:2px]`;

function splitDisplayName(name: string): DisplayName {
  const [firstName, ...rest] = name.trim().split(/\s+/u);
  return {
    firstName: firstName ?? name,
    lastName: rest.join(" ") || name,
  };
}

export default function Hero({ profile }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const backdropRef = useRef<HTMLParagraphElement>(null);
  const nameBackRef = useRef<HTMLHeadingElement>(null);
  const nameFrontRef = useRef<HTMLDivElement>(null);
  const portraitParallaxRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { firstName, lastName } = splitDisplayName(profile.name);

  useGSAP(
    () => {
      const root = rootRef.current;
      const kicker = kickerRef.current;
      const backdrop = backdropRef.current;
      const nameBack = nameBackRef.current;
      const nameFront = nameFrontRef.current;
      const portraitParallax = portraitParallaxRef.current;
      const portrait = portraitRef.current;
      const bottom = bottomRef.current;

      if (
        !root ||
        !kicker ||
        !backdrop ||
        !nameBack ||
        !nameFront ||
        !portraitParallax ||
        !portrait ||
        !bottom
      ) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const nameLines = gsap.utils.toArray<HTMLSpanElement>("span", nameBack);
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

        intro
          .from(backdrop, { opacity: 0, duration: 1.2 })
          .from(
            nameLines,
            { yPercent: 28, opacity: 0, duration: 1.05, stagger: 0.08 },
            0.08,
          )
          .from(
            portrait,
            {
              clipPath: "inset(100% 0 0 0)",
              duration: 1.15,
              ease: "power4.inOut",
            },
            0.16,
          )
          .from(nameFront, { opacity: 0, duration: 0.55 }, 0.55)
          .from(kicker, { y: 16, opacity: 0, duration: 0.7 }, 0.35)
          .from(bottom, { y: 24, opacity: 0, duration: 0.8 }, 0.42);

        gsap.to(portraitParallax, {
          yPercent: 16,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(backdrop, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        const portraitX = gsap.quickTo(portrait, "x", {
          duration: 0.6,
          ease: "power3.out",
        });
        const portraitY = gsap.quickTo(portrait, "y", {
          duration: 0.6,
          ease: "power3.out",
        });
        const backdropX = gsap.quickTo(backdrop, "x", {
          duration: 0.8,
          ease: "power3.out",
        });
        const backdropY = gsap.quickTo(backdrop, "y", {
          duration: 0.8,
          ease: "power3.out",
        });

        const onPointerMove = (event: PointerEvent): void => {
          const x = (event.clientX / window.innerWidth - 0.5) * 48;
          const y = (event.clientY / window.innerHeight - 0.5) * 32;
          portraitX(x);
          portraitY(y);
          backdropX(-x * 0.75);
          backdropY(-y * 0.55);
        };

        const onPointerLeave = (): void => {
          portraitX(0);
          portraitY(0);
          backdropX(0);
          backdropY(0);
        };

        root.addEventListener("pointermove", onPointerMove);
        root.addEventListener("pointerleave", onPointerLeave);

        return () => {
          root.removeEventListener("pointermove", onPointerMove);
          root.removeEventListener("pointerleave", onPointerLeave);
        };
      });

      return () => {
        media.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative isolate min-h-svh overflow-hidden bg-ink text-paper"
    >
      <p
        ref={kickerRef}
        className="absolute top-[5.75rem] left-5 z-10 m-0 text-[11px] tracking-[0.32em] text-accent uppercase md:top-[6.25rem] md:left-10"
      >
        {profile.role}
        <span className="text-muted"> — {profile.location}</span>
      </p>

      <div className="relative grid min-h-svh place-items-center px-5 pt-28 pb-40 md:px-10 md:pt-32 md:pb-36">
        <p
          ref={backdropRef}
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 z-0 m-0 max-w-none select-none font-display text-[clamp(5.5rem,24vw,28rem)] font-bold tracking-[-0.08em] whitespace-nowrap text-transparent uppercase max-[479px]:text-[42vw] [-webkit-text-stroke:1px_rgba(243,238,228,0.16)] leading-[0.75] will-change-transform"
        >
          Fullstack
        </p>

        <h1
          ref={nameBackRef}
          className="pointer-events-none col-start-1 row-start-1 z-[1] m-0 flex w-full flex-col items-center text-center"
        >
          <span className={NAME_SOLID}>{firstName}</span>
          <span className={NAME_OUTLINE}>{lastName}</span>
        </h1>

        <div
          ref={portraitParallaxRef}
          className="pointer-events-none col-start-1 row-start-1 z-[2] w-[min(58vw,280px)] md:w-[min(36vw,420px)] xl:w-[min(32vw,460px)]"
        >
          <div
            ref={portraitRef}
            className="relative aspect-[3/4] w-full overflow-hidden will-change-transform"
          >
            <Image
              src={profile.portrait}
              alt={`Portrait of ${profile.name}`}
              fill
              priority
              sizes="(min-width: 1200px) 460px, (min-width: 768px) 36vw, 58vw"
              className="object-cover object-[50%_12%] brightness-[0.78] contrast-[1.22] saturate-[0.45] grayscale-[0.42]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(7_7_7/0.42)_0%,transparent_22%,transparent_62%,rgb(7_7_7/0.88)_100%),linear-gradient(90deg,rgb(7_7_7/0.5)_0%,transparent_18%,transparent_82%,rgb(7_7_7/0.5)_100%)]"
            />
          </div>
        </div>

        <div
          ref={nameFrontRef}
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 z-[3] m-0 flex w-full flex-col items-center text-center [clip-path:inset(48%_0_0_0)] max-[479px]:[clip-path:inset(54%_0_0_0)]"
        >
          <span className={NAME_SOLID}>{firstName}</span>
          <span className={NAME_OUTLINE}>{lastName}</span>
        </div>
      </div>

      <div
        ref={bottomRef}
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-6 px-5 pb-7 md:flex-row md:items-end md:justify-between md:gap-8 md:px-10 md:pb-10"
      >
        <p className="m-0 max-w-xl text-[0.95rem] leading-relaxed text-pretty text-muted md:max-w-md md:text-[1.05rem] xl:max-w-lg">
          {TAGLINE}
        </p>
        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <Button href="#work">View Projects</Button>
          </Magnetic>
          <Magnetic>
            <Button href="#contact" variant="ghost">
              Let&apos;s Talk
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
