"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap, useGSAP } from "@/lib/gsap-client";
import { useLenisControl } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/cn";

type MenuLink = {
  href: string;
  label: string;
};

type SplitHoverLinkProps = {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
};

type MenuContextValue = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  pageStageRef: React.RefObject<HTMLDivElement | null>;
};

type MenuProviderProps = {
  children: React.ReactNode;
};

type PageStageProps = {
  children: React.ReactNode;
};

const PRIMARY_LINKS: MenuLink[] = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

const SECONDARY_LINKS: MenuLink[] = [
  { href: "https://github.com/ShubhamNegi-07", label: "GitHub" },
  { href: "https://linkedin.com/in/shubham-negi", label: "LinkedIn" },
  { href: "mailto:hello@shubhamnegi.dev", label: "Email" },
];

const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenu(): MenuContextValue {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within MenuProvider");
  }
  return context;
}

function splitChars(label: string): string[] {
  return Array.from(label);
}

function SplitHoverLink({ href, label, className, onClick }: SplitHoverLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const chars = splitChars(label);
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  useGSAP(
    () => {
      const link = ref.current;
      if (!link) return;

      const clone = link.querySelector(".clone");
      const charsNodes = link.querySelectorAll(".char");
      if (!clone) return;

      gsap.set(clone, { yPercent: 100 });

      const onEnter = (): void => {
        gsap.to(charsNodes, {
          yPercent: -100,
          stagger: { amount: 0.2 },
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      };

      const onLeave = (): void => {
        gsap.to(charsNodes, {
          yPercent: 0,
          stagger: { amount: 0.2, from: "end" },
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      };

      link.addEventListener("mouseenter", onEnter);
      link.addEventListener("mouseleave", onLeave);

      return () => {
        link.removeEventListener("mouseenter", onEnter);
        link.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={cn(
        "relative block cursor-pointer overflow-hidden font-display leading-none uppercase",
        className,
      )}
    >
      <span className="original relative block py-[0.12em]">
        {chars.map((char, index) => (
          <span key={`o-${char}-${index}`} className="char inline-block will-change-transform">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span className="clone absolute top-0 left-0 block w-full py-[0.12em]">
        {chars.map((char, index) => (
          <span key={`c-${char}-${index}`} className="char inline-block will-change-transform">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </a>
  );
}

export function MenuProvider({ children }: MenuProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pageStageRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback((): void => {
    setIsOpen((open) => !open);
  }, []);

  const close = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const value = useMemo<MenuContextValue>(
    () => ({ isOpen, toggle, close, pageStageRef }),
    [isOpen, toggle, close],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function PageStage({ children }: PageStageProps) {
  const { pageStageRef } = useMenu();

  return (
    <div
      ref={pageStageRef}
      data-page-stage
      className="relative z-[3] origin-center bg-ink [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]"
    >
      {children}
    </div>
  );
}

export default function Menu() {
  const { isOpen, close, pageStageRef } = useMenu();
  const { stop, start } = useLenisControl();
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasMountedRef = useRef(false);

  useGSAP(
    () => {
      const content = contentRef.current;
      if (!content) return;
      gsap.set(content, {
        z: 350,
        filter: "blur(10px)",
        opacity: 0,
      });
    },
    { scope: contentRef },
  );

  useEffect(() => {
    const page = pageStageRef.current;
    const content = contentRef.current;
    if (!page || !content) return;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isOpen) {
      stop();
      document.documentElement.classList.add("overflow-hidden");

      const rect = page.getBoundingClientRect();
      const x = ((window.innerWidth / 2 - rect.left) / Math.max(rect.width, 1)) * 100;
      const y = ((window.innerHeight / 2 - rect.top) / Math.max(rect.height, 1)) * 100;

      if (reduceMotion) {
        gsap.set(page, {
          clipPath: `polygon(${x}% ${y}%, ${x}% ${y}%, ${x}% ${y}%, ${x}% ${y}%)`,
          scale: 0.5,
          transformOrigin: `${x}% ${y}%`,
        });
        gsap.set(content, { z: 0, filter: "blur(0px)", opacity: 1 });
        return;
      }

      gsap.set(page, { transformOrigin: `${x}% ${y}%` });
      timelineRef.current?.kill();

      const timeline = gsap.timeline();
      timeline
        .to(page, {
          clipPath: `polygon(${x}% ${y}%, ${x}% ${y}%, ${x}% ${y}%, ${x}% ${y}%)`,
          scale: 0.5,
          duration: 1,
          ease: "power3.inOut",
        })
        .to(
          content,
          {
            z: 0,
            filter: "blur(0px)",
            opacity: 1,
            duration: 1,
            ease: "power3.inOut",
          },
          "<",
        );

      timelineRef.current = timeline;
      return;
    }

    const onClosed = (): void => {
      start();
      document.documentElement.classList.remove("overflow-hidden");
      gsap.set(page, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        scale: 1,
        clearProps: "transform",
      });
      gsap.set(content, {
        z: 350,
        filter: "blur(10px)",
        opacity: 0,
      });
    };

    if (reduceMotion) {
      onClosed();
      return;
    }

    const timeline = timelineRef.current;
    if (timeline && timeline.progress() > 0) {
      timeline.eventCallback("onReverseComplete", onClosed);
      timeline.reverse();
      return;
    }

    onClosed();
  }, [isOpen, pageStageRef, start, stop]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  return (
    <div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!isOpen}
      className="pointer-events-none fixed inset-0 z-[2] h-svh w-full overflow-hidden bg-ink [perspective:1000px] [transform-style:preserve-3d]"
    >
      <div
        ref={contentRef}
        className="absolute inset-0 flex h-full w-full origin-center flex-col will-change-[transform,opacity,filter] [transform-style:preserve-3d]"
      >
        <div
          className={cn(
            "flex h-full min-h-0 flex-col px-6 pt-24 pb-6 md:px-10 md:pt-28 md:pb-8",
            isOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 md:gap-10">
            <nav className="flex flex-col items-center gap-2 md:gap-3">
              {PRIMARY_LINKS.map((item) => (
                <div key={item.href}>
                  <SplitHoverLink
                    href={item.href}
                    label={item.label}
                    onClick={close}
                    className="text-3xl md:text-5xl"
                  />
                </div>
              ))}
            </nav>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-x-10">
              {SECONDARY_LINKS.map((item) => (
                <SplitHoverLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  onClick={close}
                  className="text-xs tracking-[0.2em] md:text-sm"
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex w-full shrink-0 flex-col items-center gap-2 text-paper md:mt-8 md:flex-row md:items-end md:justify-between">
            <p className="hidden text-xs tracking-[0.16em] text-paper/50 uppercase md:block">
              Copyright © {new Date().getFullYear()}
            </p>
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs tracking-[0.16em] text-paper/50 uppercase">
                Shubham Negi
              </p>
              <p className="font-display text-sm tracking-[0.18em] uppercase">
                Full-Stack Developer
              </p>
            </div>
            <p className="hidden text-xs tracking-[0.16em] text-paper/50 uppercase md:block">
              hello@shubhamnegi.dev
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
