import type { Project } from "@/types";
import ProjectCard from "@/components/ui/ProjectCard";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading
          index="03"
          eyebrow="Projects"
          title="Full-stack applications — from schema to production."
        />
        <div className="mt-16">
          {projects.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
