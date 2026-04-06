import { execSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { toolDefinitions } from "@/lib/tools";

function lastContentCommitDate(): Date {
  try {
    const iso = execSync("git log -1 --format=%cI -- src/", {
      encoding: "utf-8",
    }).trim();
    return new Date(iso);
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = lastContentCommitDate();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const toolRoutes: MetadataRoute.Sitemap = toolDefinitions
    .filter((tool) => tool.available)
    .map((tool) => ({
      url: `${siteUrl}${tool.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...toolRoutes];
}
