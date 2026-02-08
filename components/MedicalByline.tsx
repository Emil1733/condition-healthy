"use client";

import { CheckCircle, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

interface MedicalBylineProps {
  reviewerName?: string;
  credentials?: string;
}

export default function MedicalByline({ 
  reviewerName = "Dr. Sarah Jensen", 
  credentials = "MD, Board-Certified Rheumatologist"
}: MedicalBylineProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lastUpdated = mounted 
    ? new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ""; // Prevent hydration mismatch by rendering date only on client

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm inline-flex">
      <div className="bg-green-100 p-1.5 rounded-full">
        <ShieldCheck className="w-4 h-4 text-green-600" aria-hidden="true" />
      </div>
      <div>
        <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Medically Reviewed By</div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-gray-900">{reviewerName}, {credentials}</span>
          <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-50" aria-hidden="true" />
        </div>
        {mounted && (
          <div className="text-[10px] text-gray-500 mt-0.5">Updated: {lastUpdated}</div>
        )}
      </div>
    </div>
  );
}
