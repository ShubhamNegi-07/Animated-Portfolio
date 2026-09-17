import { defineField, defineType } from "sanity";

export const skillCategory = defineType({
  name: "skillCategory",
  title: "Tech Stack Category",
  type: "document",
  fields: [
    defineField({
      name: "index",
      title: "Index",
      type: "string",
      description: "e.g. 01",
    }),
    defineField({
      name: "title",
      title: "Category",
      type: "string",
      description: "Frontend, Backend, or Database & DevOps",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "orderRank",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "index" },
  },
});
