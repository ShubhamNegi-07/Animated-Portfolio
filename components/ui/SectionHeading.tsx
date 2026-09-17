import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  index?: string;
  eyebrow?: string;
  title: string;
  className?: string;
};

export default function SectionHeading({
  index,
  eyebrow,
  title,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-3 text-[11px] tracking-[0.28em] uppercase text-muted">
        {index ? <span className="text-accent">{index}</span> : null}
        {eyebrow ? <span>{eyebrow}</span> : null}
      </div>
      <h2 className="font-display max-w-4xl text-4xl leading-[0.95] font-semibold tracking-tight text-balance md:text-6xl">
        {title}
      </h2>
    </div>
  );
}
