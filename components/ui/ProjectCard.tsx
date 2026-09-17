"use client";

import { motion } from "framer-motion";
import type { Project } from "@/types";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group grid gap-6 border-t border-line py-12 md:grid-cols-12 md:items-end"
    >
      <div className="md:col-span-5">
        <p className="text-[11px] tracking-[0.28em] text-muted uppercase">
          {project.year} / {project.category}
        </p>
        <h3 className="font-display mt-3 text-3xl md:text-5xl">{project.title}</h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          {project.description}
        </p>
        {project.architecture ? (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted/80">
            {project.architecture}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack?.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-line px-3 py-1 text-[11px] tracking-[0.16em] text-muted uppercase"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-5 text-[11px] tracking-[0.2em] uppercase">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:text-paper"
            >
              Live demo
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent"
            >
              GitHub
            </a>
          ) : null}
        </div>
      </div>
      <div className="relative md:col-span-7">
        <div className="overflow-hidden rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.coverImage}
            alt={project.title}
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
      </div>
    </motion.article>
  );
}
