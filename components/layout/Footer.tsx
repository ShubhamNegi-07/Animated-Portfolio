import type { Profile } from "@/types";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-line px-5 py-10 md:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl">{profile.name}</p>
          <p className="mt-2 text-sm text-muted">{profile.location}</p>
        </div>
        <div className="flex flex-wrap gap-5 text-[11px] tracking-[0.2em] uppercase">
          {profile.socials.map((social) => (
            <a key={social.label} href={social.url} target="_blank" rel="noreferrer">
              {social.label}
            </a>
          ))}
        </div>
        <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
          © {new Date().getFullYear()} — All rights reserved
        </p>
      </div>
    </footer>
  );
}
