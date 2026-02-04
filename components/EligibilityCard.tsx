"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface EligibilityCardProps {
  condition: string;
  location: string;
  payout: string;
  onCheckClick: () => void;
}

export default function EligibilityCard({ condition, location, payout, onCheckClick }: EligibilityCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = () => {
    setIsLoading(true);
    // Simulate a small delay for "Processing"...
    setTimeout(() => {
        setIsLoading(false);
        onCheckClick();
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 max-w-sm w-full mx-auto md:mx-0 sticky top-24">
      {/* Header */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Am I Eligible?
      </h3>
      <p className="text-gray-500 mb-6 text-sm">
        Check if you qualify for the <span className="font-semibold text-blue-700">{payout}</span> compensation.
      </p>

      {/* Checklist */}
      <div className="space-y-4 mb-8">
        <div className="flex items-start">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <span className="text-gray-700 font-medium">Diagnosed with {condition}?</span>
        </div>
        <div className="flex items-start">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <span className="text-gray-700 font-medium">Aged 18-65?</span>
        </div>
        <div className="flex items-start">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <span className="text-gray-700 font-medium">Live near {location}?</span>
        </div>
      </div>

      {/* Massive CTA Button */}
      <button
        onClick={handleApply}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 rounded-lg shadow-lg transform transition active:scale-95 flex justify-center items-center"
      >
        {isLoading ? (
            <span className="animate-pulse">Checking...</span>
        ) : (
            "CHECK MY ELIGIBILITY"
        )}
      </button>

      <p className="text-xs text-center text-gray-400 mt-4">
        100% Free • No Insurance Required
      </p>
    </div>
  );
}
