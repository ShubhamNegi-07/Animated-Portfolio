export const profileQuery = `*[_type == "profile"][0]{
  name,
  role,
  tagline,
  intro,
  bio,
  email,
  location,
  availability,
  resumeUrl,
  "portrait": portrait.asset->url,
  highlights,
  socials
}`;

export const projectsQuery = `*[_type == "project"] | order(year desc, _updatedAt desc){
  _id,
  title,
  "slug": slug.current,
  year,
  timeline,
  category,
  description,
  architecture,
  techStack,
  "coverImage": coverImage.asset->url,
  liveUrl,
  githubUrl,
  featured
}`;

export const skillCategoriesQuery = `*[_type == "skillCategory"] | order(orderRank asc){
  _id,
  title,
  index,
  description,
  skills
}`;

export const testimonialsQuery = `*[_type == "testimonial"] | order(_createdAt desc){
  _id,
  quote,
  author,
  role,
  company,
  "avatar": avatar.asset->url
}`;

export const settingsQuery = `*[_type == "settings"][0]{
  title,
  description,
  "ogImage": ogImage.asset->url
}`;
