import { SITE_CONFIG } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabase.admin";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.baseUrl;

  // 1. Fetch only pages that have pre-generated AI content (Grade A)
  const { data: contents } = await supabaseAdmin
    .from("page_content")
    .select("path_slug")
    .limit(5000);

  const conditions = ["psoriasis", "diabetes", "migraine", "eczema", "arthritis"];

  // 2. Generate Hub Pages (Authority Categorical Pages)
  const hubPages = conditions.map((cond) => ({
    url: `${baseUrl}/trials/${cond}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const, // Hubs change less frequently than listings
    priority: 0.9,
  }));

  // 3. Map Trial Pages (Grade A Content)
  const trialPages = (contents || []).map((content: { path_slug: string }) => ({
    url: `${baseUrl}/trials/${content.path_slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const, // Stratify crawl budget
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/trials`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/editorial`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/medical-review`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    ...hubPages,
    ...trialPages,
  ];
}
