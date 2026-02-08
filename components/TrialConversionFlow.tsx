"use client";

import { useState, useEffect } from "react";
import EligibilityCard from "./EligibilityCard";
import QuizModal from "./QuizModal";

interface TrialConversionFlowProps {
  condition: string;
  city: string;
  payout: string;
}

export default function TrialConversionFlow({ condition, city, payout }: TrialConversionFlowProps) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Elite trust engineering: Allow triggering the quiz from anywhere (e.g. study listings)
  useEffect(() => {
    const handleOpenQuiz = () => setIsQuizOpen(true);
    window.addEventListener("open-eligibility-quiz", handleOpenQuiz);
    return () => window.removeEventListener("open-eligibility-quiz", handleOpenQuiz);
  }, []);

  return (
    <>
      <EligibilityCard
        condition={condition}
        location={city}
        payout={payout}
        onCheckClick={() => setIsQuizOpen(true)}
      />
      
      <QuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
        condition={condition}
        city={city}
      />
    </>
  );
}
