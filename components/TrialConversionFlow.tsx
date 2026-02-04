"use client";

import { useState } from "react";
import EligibilityCard from "./EligibilityCard";
import QuizModal from "./QuizModal";

interface TrialConversionFlowProps {
  condition: string;
  city: string;
  payout: string;
}

export default function TrialConversionFlow({ condition, city, payout }: TrialConversionFlowProps) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

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
      />
    </>
  );
}
