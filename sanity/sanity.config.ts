import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./env";
import { schemaTypes } from "./schemas";

const singletonTypes = new Set(["profile", "settings"]);

export default defineConfig({
  name: "animated-portfolio",
  title: "Shubham Negi",
  projectId: projectId || "placeholder",
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Profile")
              .id("profile")
              .child(S.document().schemaType("profile").documentId("profile")),
            S.listItem()
              .title("Site Settings")
              .id("settings")
              .child(S.document().schemaType("settings").documentId("settings")),
            S.divider(),
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("skillCategory").title("Tech Stack"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
});
