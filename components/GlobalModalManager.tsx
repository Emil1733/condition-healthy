"use client";

import { useEffect, useState } from "react";
import QuizModal from "./QuizModal";
import { usePathname, useSearchParams } from "next/navigation";

export default function GlobalModalManager() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Deduce context from URL if possible
  // e.g. /trials/psoriasis/austin-tx -> condition=psoriasis, city=austin-tx
  // This is a naive extraction for the "global" modal if triggered from generic pages
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  const condition = pathParts[1] || "Clinical Trial"; 
  const citySlug = pathParts[2] || "your area";
  
  const city = citySlug.replace(/-/g, ' ');

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-eligibility-quiz", handleOpen);
    return () => window.removeEventListener("open-eligibility-quiz", handleOpen);
  }, []);

  // Also listen for ?eligibility=open query param (for ad campaigns)
  useEffect(() => {
    if (searchParams.get("eligibility") === "open") {
      setIsOpen(true);
    }
  }, [searchParams]);

  return (
    <QuizModal 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
      condition={condition.charAt(0).toUpperCase() + condition.slice(1)}
      city={city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
    />
  );
}
