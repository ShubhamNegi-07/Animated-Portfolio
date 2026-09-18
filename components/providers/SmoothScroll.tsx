"use client";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap-client";

type LenisControl = {
  stop: () => void;
  start: () => void;
};

const LenisContext = createContext<LenisControl>({
  stop: () => undefined,
  start: () => undefined,
});

export function useLenisControl(): LenisControl {
  return useContext(LenisContext);
}

type SmoothScrollProps = {
  children: React.ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const apiRef = useRef<LenisControl>({
    stop: () => undefined,
    start: () => undefined,
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      infinite: false,
    });

    apiRef.current.stop = () => lenis.stop();
    apiRef.current.start = () => lenis.start();

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const api = useMemo<LenisControl>(
    () => ({
      stop: () => apiRef.current.stop(),
      start: () => apiRef.current.start(),
    }),
    [],
  );

  return <LenisContext.Provider value={api}>{children}</LenisContext.Provider>;
}
