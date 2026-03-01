import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { toolDefinitions } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const toolRoutes: MetadataRoute.Sitemap = toolDefinitions
    .filter((tool) => tool.available)
    .map((tool) => ({
      url: `${siteUrl}${tool.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...toolRoutes];
}
