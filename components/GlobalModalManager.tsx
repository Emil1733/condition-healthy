"use client";

import { useEffect, useState } from "react";
import QuizModal from "./QuizModal";
import { usePathname, useSearchParams } from "next/navigation";

export default function GlobalModalManager() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Deduce context from URL
  // Legacy: /trials/[condition]/[city-state]
  // New: /study/[condition]_[city-state]
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  const routeType = pathParts[0]; // "trials" or "study"
  
  let rawCondition = "Clinical Trial";
  let rawCity = "your area";

  if (routeType === "trials") {
    rawCondition = pathParts[1] || rawCondition;
    rawCity = (pathParts[2] || rawCity).replace(/-/g, ' ');
  } else if (routeType === "study") {
    const slug = pathParts[1] || "";
    const underscoreIdx = slug.indexOf("_");
    if (underscoreIdx !== -1) {
      rawCondition = slug.slice(0, underscoreIdx);
      rawCity = slug.slice(underscoreIdx + 1).replace(/-/g, ' ');
    } else {
      rawCondition = slug || rawCondition;
    }
  }

  const condition = rawCondition.charAt(0).toUpperCase() + rawCondition.slice(1).replace(/-/g, ' ');
  const city = rawCity.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

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
      condition={condition}
      city={city}
    />
  );
}
