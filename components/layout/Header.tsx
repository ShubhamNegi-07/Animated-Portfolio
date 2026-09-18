"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/types";
import Magnetic from "@/components/animation/Magnetic";
import { useMenu } from "@/components/layout/Menu";
import { cn } from "@/lib/cn";

type HeaderProps = {
  profile: Profile;
};

type IndiaClockProps = {
  time: string;
  iso?: string;
  className?: string;
};

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
  return indiaTimeFormatter.format(date);
}

function IndiaClock({ time, iso, className }: IndiaClockProps) {
  return (
    <time
      dateTime={iso}
      aria-label={`Current time in India, ${INDIA_OFFSET_LABEL}`}
      className={cn("flex flex-col items-start justify-center leading-tight", className)}
    >
      <span className="font-sans text-xs tracking-normal text-paper tabular-nums md:text-sm">
        {time}
      </span>
      <span className="mt-0.5 text-[10px] tracking-normal text-muted">
        ({INDIA_OFFSET_LABEL})
      </span>
    </time>
  );
}

function StatusBadge({ detail }: { detail: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <p className="m-0 flex flex-col leading-tight">
        <span className="text-xs tracking-wide text-paper uppercase md:text-sm">
          Available for project
        </span>
        <span className="mt-0.5 text-[10px] tracking-wide text-muted uppercase">
          {detail}
        </span>
      </p>
    </div>
  );
}

export default function Header({ profile }: HeaderProps) {
  const { isOpen, toggle, close } = useMenu();
  const [now, setNow] = useState<Date | null>(null);
  const isAvailable = /open/i.test(profile.availability);
  const statusDetail = isAvailable ? "NOW / READY" : profile.availability;
  const displayName = `${profile.name.toUpperCase()}\u00AE`;
  const clockTime = now ? formatIndiaTime(now) : "—";
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ink text-paper">
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between bg-ink px-5 md:h-24 md:px-10">
        <a
          href="#top"
          onClick={close}
          className="font-display shrink-0 text-lg font-bold tracking-tight whitespace-nowrap uppercase md:text-2xl"
        >
          {displayName}
        </a>

        <div className="ml-auto flex items-center gap-x-4 sm:gap-x-5 md:gap-x-7">
          <div className="hidden md:block">
            <StatusBadge detail={statusDetail} />
          </div>

          <IndiaClock
            time={clockTime}
            iso={clockIso}
            className="hidden sm:flex"
          />

          <Magnetic>
            <a
              href="#contact"
              onClick={close}
              className="hidden items-center justify-center rounded-full border border-line px-6 py-2.5 text-xs tracking-[0.2em] text-paper uppercase transition-colors duration-300 hover:border-accent hover:text-accent sm:inline-flex"
            >
              Let&apos;s Talk
            </a>
          </Magnetic>

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="site-menu"
            onClick={toggle}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ink transition-colors duration-300 hover:border-accent md:h-12 md:w-12"
          >
            <span className="relative block h-3.5 w-6">
              <span
                className={cn(
                  "absolute top-0.5 left-0 h-0.5 w-full bg-paper transition-transform duration-300",
                  isOpen && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0.5 left-0 h-0.5 w-full bg-paper transition-transform duration-300",
                  isOpen && "-translate-y-[5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
