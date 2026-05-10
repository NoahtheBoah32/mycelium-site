// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "master",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images/cms",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "event",
        label: "Events",
        path: "src/content/events",
        format: "md",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => values?.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ?? ""
          }
        },
        fields: [
          { type: "string", name: "title", label: "Event Title", isTitle: true, required: true },
          {
            type: "string",
            name: "template",
            label: "Card Style",
            required: true,
            options: [
              { value: "kapihan", label: "Kapihan (green, recurring)" },
              { value: "bag", label: "Baganihan (dark glass, one-time talk)" }
            ]
          },
          { type: "string", name: "schedule", label: "Schedule Line (display text)" },
          { type: "datetime", name: "date", label: "Event Date" },
          { type: "string", name: "time", label: "Time (e.g. 8:00 PM PHT)" },
          { type: "string", name: "location", label: "Location" },
          { type: "string", name: "notes", label: "Extra Detail (e.g. Free Coffee)" },
          { type: "boolean", name: "isOnline", label: "Online Event" },
          { type: "boolean", name: "isFree", label: "Free Entry" },
          { type: "boolean", name: "isRecurring", label: "Recurring Event" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "string", name: "ctaLabel", label: "Button Label" },
          { type: "string", name: "ctaUrl", label: "Button URL" },
          { type: "image", name: "image", label: "Event Image (Kapihan card)" },
          { type: "number", name: "sortOrder", label: "Sort Order (lower = first)" },
          { type: "string", name: "speakerName", label: "Speaker Name" },
          { type: "string", name: "speakerRole", label: "Speaker Role" },
          { type: "string", name: "speakerBio", label: "Speaker Bio", ui: { component: "textarea" } },
          { type: "string", name: "organizer", label: "Organizer Name" },
          { type: "image", name: "organizerLogo", label: "Organizer Logo" }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
