import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "e.g. SaaS Platform, Auth & APIs, Full-Stack App",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      description: "What it does and the stack/architecture behind it.",
    }),
    defineField({
      name: "architecture",
      title: "Architecture notes",
      type: "text",
      rows: 4,
      description: "Optional extra detail: data flow, hosting, auth, jobs.",
    }),
    defineField({
      name: "techStack",
      title: "Tech stack badges",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "e.g. Next.js, PostgreSQL, Prisma",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "liveUrl",
      title: "Live demo URL",
      type: "url",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub repository URL",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage", subtitle: "category" },
  },
});
