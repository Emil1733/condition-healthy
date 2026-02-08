
"use server";

import { supabase } from "@/lib/supabase.custom";

export async function submitLead(formData: {
  email: string;
  condition: string;
  city: string;
  answers: any;
}) {
  console.log("🚀 Submitting Lead:", formData.email);

  const { data, error } = await supabase.from("leads").insert([
    {
      email: formData.email,
      condition: formData.condition,
      city: formData.city,
      answers: formData.answers,
      status: "pending",
    },
  ]);

  if (error) {
    console.error("❌ Submission Error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
