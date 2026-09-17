import type { Profile } from "@/types";
import Magnetic from "@/components/animation/Magnetic";

const nav = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Header({ profile }: { profile: Profile }) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 mix-blend-difference">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10">
        <a href="#top" className="font-display text-sm tracking-[0.24em] uppercase">
          {profile.name}
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Magnetic key={item.href}>
              <a
                href={item.href}
                className="text-[11px] tracking-[0.22em] text-paper uppercase"
              >
                {item.label}
              </a>
            </Magnetic>
          ))}
        </nav>
        <a
          href={`mailto:${profile.email}`}
          className="text-[11px] tracking-[0.22em] uppercase"
        >
          Hire me
        </a>
      </div>
    </header>
  );
}
