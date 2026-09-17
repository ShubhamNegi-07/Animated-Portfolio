"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-client";
import "./preloader.css";

const WORDS = [
  "नमस्ते",
  "Hello",
  "こんにちは",
  "你好",
  "مرحبا",
  "Привет",
  "Hallo",
  "Ciao",
  "Olá",
  "안녕하세요",
  "নমস্কার",
  "Cześć",
  "Bonjour",
  "Hola",
];

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const wordARef = useRef<HTMLParagraphElement>(null);
  const wordBRef = useRef<HTMLParagraphElement>(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const curtain = curtainRef.current;
    const wordA = wordARef.current;
    const wordB = wordBRef.current;
    if (!root || !curtain || !wordA || !wordB) return;

    let cancelled = false;
    document.documentElement.classList.add("preloader-locked");

    const finish = () => {
      if (cancelled) return;
      document.documentElement.classList.remove("preloader-locked");
      setDone(true);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 0.03 : 0.06;
    const fade = reduced ? 0.05 : 0.1;
    const curtainDuration = reduced ? 0.4 : 0.68;

    const ctx = gsap.context(() => {
      gsap.set(curtain, { yPercent: 0, force3D: true });
      gsap.set(wordA, { autoAlpha: 1, force3D: true });
      gsap.set(wordB, { autoAlpha: 0, force3D: true });
      wordA.textContent = WORDS[0];
      wordB.textContent = WORDS[1] ?? "";

      const timeline = gsap.timeline({
        defaults: { overwrite: "auto", force3D: true, lazy: false },
        onComplete: finish,
      });

      WORDS.slice(1).forEach((text, index) => {
        const incoming = index % 2 === 0 ? wordB : wordA;
        const outgoing = index % 2 === 0 ? wordA : wordB;
        const at = `+=${hold}`;

        timeline.call(
          () => {
            incoming.textContent = text;
          },
          undefined,
          at,
        );

        timeline.to(
          outgoing,
          { autoAlpha: 0, duration: fade, ease: "none" },
          at,
        );

        timeline.to(
          incoming,
          {
            autoAlpha: 1,
            duration: fade,
            ease: "none",
            immediateRender: false,
          },
          at,
        );
      });

      timeline.to(
        [wordA, wordB],
        { autoAlpha: 0, duration: 0.08, ease: "power2.in" },
        `+=${hold}`,
      );

      timeline.to(
        curtain,
        {
          yPercent: -101,
          duration: curtainDuration,
          ease: "power4.inOut",
        },
        "<",
      );
    }, root);

    return () => {
      cancelled = true;
      ctx.revert();
      document.documentElement.classList.remove("preloader-locked");
    };
  }, []);

  if (done) return null;

  return (
    <div id="preloader" ref={rootRef} aria-hidden>
      <div id="curtain" ref={curtainRef}>
        <div id="word-stage">
          <p id="word" className="word is-visible" ref={wordARef} dir="auto">
            {WORDS[0]}
          </p>
          <p className="word" ref={wordBRef} dir="auto" />
        </div>
      </div>
    </div>
  );
}
