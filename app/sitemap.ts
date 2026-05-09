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

  // 2. Fetch Individual Clinical Trials (Long-tail Nodes)
  let allStudies: any[] = [];
  from = 0;
  while (allStudies.length < 5000) { // Safety cap at 5k for sitemap performance
    const { data } = await supabaseAdmin
      .from("studies")
      .select("nct_id")
      .range(from, from + 999);
    if (!data || data.length === 0) break;
    allStudies = [...allStudies, ...data];
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

  // Individual Study Nodes (Long-tail SEO - Priority: 0.6)
  const studyNodes = (allStudies || []).map((study: { nct_id: string }) => ({
    url: `${baseUrl}/study/${study.nct_id}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.6,
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
    ...studyNodes,
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
