"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap-client";
import "./preloader.css";

const WORDS = [
  "नमस्ते",
  "Hello",
  "こんにちは",
  "你好",
  "مرحبا",
  "Bonjour",
  "Hola",
  "Ciao",
  "Hallo",
];

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const wordARef = useRef<HTMLParagraphElement>(null);
  const wordBRef = useRef<HTMLParagraphElement>(null);
  const [complete, setComplete] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      const curtain = curtainRef.current;
      const wordA = wordARef.current;
      const wordB = wordBRef.current;
      if (!root || !curtain || !wordA || !wordB) return;

      const unlock = () => {
        document.documentElement.classList.remove("preloader-locked");
      };

      document.documentElement.classList.add("preloader-locked");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        unlock();
        setComplete(true);
        return unlock;
      }

      const layers = [wordA, wordB];
      gsap.set(root, { autoAlpha: 1 });
      gsap.set(curtain, { yPercent: 0, force3D: true });
      gsap.set(layers, { autoAlpha: 0, y: 0, force3D: true });
      wordA.textContent = WORDS[0];
      wordB.textContent = "";

      const timeline = gsap.timeline({
        defaults: {
          overwrite: true,
          force3D: true,
          lazy: false,
        },
        onComplete: () => {
          gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
          unlock();
          setComplete(true);
        },
      });

      timeline.to(wordA, {
        autoAlpha: 1,
        duration: 0.16,
        ease: "power2.out",
      });

      WORDS.slice(1).forEach((text, index) => {
        const incoming = index % 2 === 0 ? wordB : wordA;
        const outgoing = index % 2 === 0 ? wordA : wordB;

        timeline.call(
          () => {
            incoming.textContent = text;
          },
          undefined,
          "+=0.05",
        );

        timeline.to(
          outgoing,
          {
            autoAlpha: 0,
            duration: 0.12,
            ease: "power2.inOut",
          },
          "<",
        );

        timeline.fromTo(
          incoming,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.12,
            ease: "power2.inOut",
            overwrite: true,
          },
          "<",
        );
      });

      timeline.to(
        layers,
        {
          autoAlpha: 0,
          duration: 0.1,
          ease: "power2.in",
          overwrite: true,
        },
        "+=0.06",
      );

      timeline.to(
        curtain,
        {
          yPercent: -100,
          duration: 0.72,
          ease: "power4.inOut",
          overwrite: true,
        },
        "<",
      );

      return () => {
        timeline.kill();
        unlock();
      };
    },
    { scope: rootRef, dependencies: [] },
  );

  if (complete) return null;

  return (
    <div id="preloader" ref={rootRef} aria-hidden>
      <div id="curtain" ref={curtainRef}>
        <div id="word-stage">
          <p id="word" className="word" ref={wordARef} dir="auto">
            {WORDS[0]}
          </p>
          <p className="word" ref={wordBRef} dir="auto" />
        </div>
      </div>
    </div>
  );
}
