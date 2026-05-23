import { SITE_CONFIG } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabase.admin";
import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.baseUrl;

  // 1. Fetch all City/Condition Hubs (The "Thick" Pages)
  let allContents: any[] = [];
  let from = 0;
  while (true) {
    const { data } = await supabaseAdmin
      .from("page_content")
      .select("path_slug")
      .range(from, from + 999);
    if (!data || data.length === 0) break;
    allContents = [...allContents, ...data];
    if (data.length < 1000) break;
    from += 1000;
  }

  const conditions = ["psoriasis", "diabetes", "migraine", "eczema", "arthritis"];
  const today = new Date();

  // Hub Pages (Categorical Priority: 0.95)
  const hubPages = conditions.map((cond) => ({
    url: `${baseUrl}/trials/${cond}`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.95,
  }));

  // City Guides (The "Thick" Authority Engine - Priority: 0.85)
  const cityGuides = (allContents || []).map((content: { path_slug: string }) => ({
    url: `${baseUrl}/study/${content.path_slug.replace("/", "_")}`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/trials`,
      lastModified: today,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...hubPages,
    ...cityGuides,
    {
      url: `${baseUrl}/editorial`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/medical-review`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ];
}
