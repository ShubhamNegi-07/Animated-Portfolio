import { defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "e.g. Full-Stack Developer",
    }),
    defineField({
      name: "tagline",
      title: "Hero headline",
      type: "text",
      rows: 3,
      description: "Main H1 on the homepage.",
    }),
    defineField({
      name: "intro",
      title: "Hero intro",
      type: "text",
      rows: 3,
      description: "Short supporting copy next to the headline.",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 8,
      description: "About section — problem solver, engineer, full-stack builder.",
    }),
    defineField({
      name: "highlights",
      title: "About highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "Short labels under the bio, e.g. Problem solver.",
      options: { layout: "tags" },
    }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "availability", title: "Availability", type: "string" }),
    defineField({ name: "resumeUrl", title: "Resume URL", type: "url" }),
    defineField({ name: "portrait", title: "Portrait", type: "image", options: { hotspot: true } }),
    defineField({
      name: "socials",
      title: "Socials",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "url", type: "url", title: "URL" },
          ],
        },
      ],
    }),
  ],
});
