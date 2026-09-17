import type { PortfolioData } from "@/types";
import profile from "@/data/mock/profile.json";
import projects from "@/data/mock/projects.json";
import skillCategories from "@/data/mock/skills.json";
import testimonials from "@/data/mock/testimonials.json";
import settings from "@/data/mock/settings.json";
import { client } from "@/lib/sanity/client";
import {
  profileQuery,
  projectsQuery,
  skillCategoriesQuery,
  settingsQuery,
  testimonialsQuery,
} from "@/lib/sanity/queries";
import { isSanityConfigured } from "@/sanity/env";

const mockData: PortfolioData = {
  profile,
  projects,
  skillCategories,
  testimonials,
  settings,
};

export async function getPortfolioData(): Promise<PortfolioData> {
  if (!isSanityConfigured || !client) {
    return mockData;
  }

  try {
    const [cmsProfile, cmsProjects, cmsSkills, cmsTestimonials, cmsSettings] =
      await Promise.all([
        client.fetch(profileQuery),
        client.fetch(projectsQuery),
        client.fetch(skillCategoriesQuery),
        client.fetch(testimonialsQuery),
        client.fetch(settingsQuery),
      ]);

    return {
      profile: cmsProfile ?? mockData.profile,
      projects: cmsProjects?.length ? cmsProjects : mockData.projects,
      skillCategories: cmsSkills?.length ? cmsSkills : mockData.skillCategories,
      testimonials: cmsTestimonials?.length
        ? cmsTestimonials
        : mockData.testimonials,
      settings: cmsSettings ?? mockData.settings,
    };
  } catch (error) {
    console.warn("[data] Sanity fetch failed, using mock content.", error);
    return mockData;
  }
}
