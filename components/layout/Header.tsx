"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/types";
import Magnetic from "@/components/animation/Magnetic";
import { cn } from "@/lib/cn";

type HeaderProps = {
  profile: Profile;
};

type NavItem = {
  href: string;
  label: string;
};

type IndiaClockProps = {
  label: string;
  iso?: string;
  className?: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "#top", label: "Home" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

const INDIA_TIME_ZONE = "Asia/Kolkata";
const INDIA_OFFSET_LABEL = "GMT+5:30";

const indiaTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: INDIA_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

function formatIndiaTime(date: Date): string {
  return `${indiaTimeFormatter.format(date)} (${INDIA_OFFSET_LABEL})`;
}

function IndiaClock({ label, iso, className }: IndiaClockProps) {
  return (
    <time
      dateTime={iso}
      aria-label={`Current time in India, ${INDIA_OFFSET_LABEL}`}
      className={cn(
        "font-sans tabular-nums tracking-[0.08em] text-paper",
        className,
      )}
    >
      {label}
    </time>
  );
}

function StatusBadge({ detail }: { detail: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </span>
      <p className="m-0 flex flex-col leading-tight">
        <span className="text-[11px] tracking-[0.18em] text-paper uppercase">
          Available for project
        </span>
        <span className="mt-0.5 text-[10px] tracking-[0.22em] text-muted uppercase">
          {detail}
        </span>
      </p>
    </div>
  );
}

export default function Header({ profile }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const isAvailable = /open/i.test(profile.availability);
  const statusDetail = isAvailable ? "NOW / READY" : profile.availability;
  const displayName = `${profile.name.toUpperCase()}\u00AE`;
  const clockLabel = now ? formatIndiaTime(now) : "—";
  const clockIso = now?.toISOString();

  useEffect(() => {
    const tick = (): void => {
      setNow(new Date());
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    document.documentElement.classList.toggle("overflow-hidden", menuOpen);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [menuOpen]);

  const closeMenu = (): void => {
    setMenuOpen(false);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-paper">
      <div className="pointer-events-auto mx-auto flex max-w-[1600px] items-center gap-4 px-5 py-4 md:gap-6 md:px-10 md:py-5">
        <a
          href="#top"
          onClick={closeMenu}
          className="font-display shrink-0 text-[11px] tracking-[0.2em] whitespace-nowrap uppercase sm:text-sm sm:tracking-[0.24em]"
        >
          {displayName}
        </a>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-8 lg:flex xl:gap-14">
          <StatusBadge detail={statusDetail} />
          <IndiaClock
            label={clockLabel}
            iso={clockIso}
            className="text-[11px] text-muted uppercase"
          />
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <IndiaClock
            label={clockLabel}
            iso={clockIso}
            className="hidden text-[10px] text-muted uppercase sm:inline lg:hidden"
          />

          <Magnetic>
            <a
              href="#contact"
              onClick={closeMenu}
              className="hidden items-center justify-center rounded-full border border-line px-5 py-2 text-[11px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 hover:border-accent hover:text-accent sm:inline-flex"
            >
              Let&apos;s Talk
            </a>
          </Magnetic>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors duration-300 hover:border-accent"
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute top-0.5 left-0 h-px w-full bg-paper transition-transform duration-300",
                  menuOpen && "translate-y-[3.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0.5 left-0 h-px w-full bg-paper transition-transform duration-300",
                  menuOpen && "-translate-y-[3.5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        className={cn(
          "fixed inset-0 z-[-1] flex min-h-svh flex-col bg-ink px-5 pt-24 pb-10 transition-opacity duration-500 md:px-10",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="lg:hidden">
          <StatusBadge detail={statusDetail} />
        </div>

        <nav className="mt-10 flex flex-1 flex-col justify-center gap-3 md:mt-0">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="font-display text-5xl leading-[0.9] font-semibold tracking-[-0.04em] text-paper uppercase transition-colors duration-300 hover:text-accent md:text-7xl"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between">
          <IndiaClock
            label={clockLabel}
            iso={clockIso}
            className="text-sm text-muted uppercase lg:hidden"
          />
          <a
            href="#contact"
            onClick={closeMenu}
            className="inline-flex w-fit items-center justify-center rounded-full border border-line px-6 py-3 text-[11px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 hover:border-accent hover:text-accent sm:hidden"
          >
            Let&apos;s Talk
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="text-[11px] tracking-[0.18em] text-muted uppercase transition-colors hover:text-accent"
          >
            {profile.email}
          </a>
        </div>
      </div>
    </header>
  );
}
