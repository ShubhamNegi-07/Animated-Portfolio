import type { Profile } from "@/types";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/animation/Magnetic";

export default function Contact({ profile }: { profile: Profile }) {
  return (
    <section id="contact" className="px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px] text-center">
        <p className="text-[11px] tracking-[0.28em] text-accent uppercase">
          05 / Contact
        </p>
        <h2 className="font-display mx-auto mt-6 max-w-4xl text-5xl leading-[0.9] md:text-8xl">
          Let&apos;s build something that scales.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-muted">{profile.availability}</p>
        <div className="mt-10">
          <Magnetic>
            <Button href={`mailto:${profile.email}`}>{profile.email}</Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
