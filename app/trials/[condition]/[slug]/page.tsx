import { redirect } from "next/navigation";

interface PageProps {
  params: {
    condition: string;
    slug: string;
  };
}

// This route was deprecated. Redirect to the new flat /study/[slug] route.
export default function LegacyCityTrialsPage({ params }: PageProps) {
  const { condition, slug } = params;
  // Build the new slug: condition + "_" + city-state
  redirect(`/study/${condition}_${slug}`);
}
