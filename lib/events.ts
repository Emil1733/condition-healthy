"use client";

/**
 * Triggers the eligibility quiz modal from anywhere in the app.
 * This allows Server Components (like the trial listings) to open 
 * the Client-side modal without complex state management.
 */
export function triggerEligibilityQuiz() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-eligibility-quiz"));
  }
}
