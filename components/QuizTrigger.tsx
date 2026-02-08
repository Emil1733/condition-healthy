"use client";

import { triggerEligibilityQuiz } from "@/lib/events";

interface QuizTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export default function QuizTrigger({ className, children }: QuizTriggerProps) {
  return (
    <button 
      onClick={() => triggerEligibilityQuiz()} 
      className={className}
    >
      {children}
    </button>
  );
}
