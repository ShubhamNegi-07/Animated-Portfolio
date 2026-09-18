"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { FaAws } from "react-icons/fa6";
import {
  SiDocker,
  SiExpress,
  SiGit,
  SiGithub,
  SiKubernetes,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiStripe,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import type { Project, ProjectInlineLink } from "@/types";

type ProjectCardProps = {
  project: Project;
  index: number;
};

type TechBadgeConfig = {
  icon: IconType;
  color: string;
};

const TECH_BADGES: Record<string, TechBadgeConfig> = {
  react: { icon: SiReact, color: "#61DAFB" },
  nextjs: { icon: SiNextdotjs, color: "#FFFFFF" },
  typescript: { icon: SiTypescript, color: "#3178C6" },
  nodejs: { icon: SiNodedotjs, color: "#5FA04E" },
  python: { icon: SiPython, color: "#3776AB" },
  postgresql: { icon: SiPostgresql, color: "#4169E1" },
  docker: { icon: SiDocker, color: "#2496ED" },
  kubernetes: { icon: SiKubernetes, color: "#326CE5" },
  tailwind: { icon: SiTailwindcss, color: "#06B6D4" },
  tailwindcss: { icon: SiTailwindcss, color: "#06B6D4" },
  prisma: { icon: SiPrisma, color: "#16A394" },
  stripe: { icon: SiStripe, color: "#635BFF" },
  mongodb: { icon: SiMongodb, color: "#47A248" },
  express: { icon: SiExpress, color: "#FFFFFF" },
  aws: { icon: FaAws, color: "#FF9900" },
  git: { icon: SiGit, color: "#F05032" },
  github: { icon: SiGithub, color: "#FFFFFF" },
  vercel: { icon: SiVercel, color: "#FFFFFF" },
  apiroutes: { icon: SiNextdotjs, color: "#FFFFFF" },
};

function techKey(name: string): string {
  return name.toLowerCase().replace(/[\s.]+/g, "");
}

function TechBadge({ name }: { name: string }) {
  const config = TECH_BADGES[techKey(name)];
  const Icon = config?.icon;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#1a1a1a] px-2 py-1 text-[11px] font-medium tracking-wide text-paper/80">
      {Icon ? (
        <Icon
          className="h-3.5 w-3.5 shrink-0"
          aria-hidden
          style={{ color: config.color }}
        />
      ) : null}
      {name}
    </span>
  );
}

function DescriptionWithLinks({
  text,
  links = [],
}: {
  text: string;
  links?: ProjectInlineLink[];
}) {
  if (!links.length) return <>{text}</>;

  const escaped = links.map((link) =>
    link.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const pattern = new RegExp(`(${escaped.join("|")})`, "g");
  const hrefByLabel = new Map(links.map((link) => [link.label, link.href]));
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        const href = hrefByLabel.get(part);
        if (!href) return <span key={`${part}-${index}`}>{part}</span>;

        return (
          <a
            key={`${part}-${index}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-muted underline-offset-4 transition-colors hover:text-paper hover:decoration-paper"
          >
            {part}
          </a>
        );
      })}
    </>
  );
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const primaryHref = project.liveUrl ?? project.githubUrl;
  const timeline = project.timeline ?? project.year;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111111]"
    >
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt={project.title}
          className="h-28 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] md:h-32"
        />
        <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ink/80 px-2.5 py-1 text-[11px] text-paper backdrop-blur-sm transition-colors hover:bg-ink"
            >
              <HiOutlineGlobeAlt className="h-3.5 w-3.5" aria-hidden />
              Website
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ink/80 px-2.5 py-1 text-[11px] text-paper backdrop-blur-sm transition-colors hover:bg-ink"
            >
              <SiGithub className="h-3.5 w-3.5" aria-hidden />
              Source
            </a>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold tracking-tight text-paper md:text-2xl">
            {project.title}
          </h3>
          {primaryHref ? (
            <a
              href={primaryHref}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title}`}
              className="mt-0.5 text-lg leading-none text-muted transition-colors group-hover:text-paper"
            >
              ↗
            </a>
          ) : null}
        </div>

        <p className="mt-1 text-sm text-muted">{timeline}</p>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          <DescriptionWithLinks
            text={project.description}
            links={project.descriptionLinks}
          />
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {project.techStack?.map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
        </div>
      </div>
    </motion.article>
  );
}
