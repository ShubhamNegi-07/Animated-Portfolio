export type SocialLink = {
  label: string;
  url: string;
};

export type Profile = {
  name: string;
  role: string;
  tagline: string;
  intro: string;
  bio: string;
  email: string;
  location: string;
  availability: string;
  resumeUrl: string;
  portrait: string;
  highlights: string[];
  socials: SocialLink[];
};

export type ProjectInlineLink = {
  label: string;
  href: string;
};

export type Project = {
  _id: string;
  title: string;
  slug: string;
  year: string;
  timeline?: string;
  category: string;
  description: string;
  descriptionLinks?: ProjectInlineLink[];
  architecture: string;
  techStack: string[];
  coverImage: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
};

export type SkillCategory = {
  _id: string;
  title: string;
  index: string;
  description: string;
  skills: string[];
};

export type Testimonial = {
  _id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
};

export type SiteSettings = {
  title: string;
  description: string;
  ogImage?: string;
};

export type PortfolioData = {
  profile: Profile;
  projects: Project[];
  skillCategories: SkillCategory[];
  testimonials: Testimonial[];
  settings: SiteSettings;
};
