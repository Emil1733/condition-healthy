"use client";

import { Activity, MapPin } from "lucide-react";
import QuizTrigger from "./QuizTrigger";

interface StudyCardProps {
  nctId: string;
  title: string;
  status: string;
  condition: string;
  city?: string;
  state?: string;
  showLocation?: boolean;
}

export default function StudyCard({ 
  nctId, 
  title, 
  status, 
  condition, 
  city, 
  state,
  showLocation = false
}: StudyCardProps) {
  // Format location if available
  const locationString = city && state ? `${city}, ${state}` : city || state || "Nationwide";

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-blue-200 transition-all group h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
            {nctId}
            <a 
              href={`https://clinicaltrials.gov/study/${nctId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-gray-400 hover:text-blue-500 underline lowercase"
              onClick={(e) => e.stopPropagation()}
            >
              (Verify)
            </a>
          </div>
          {/* Mobile Quiz Trigger (Optional) */}
        </div>

        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-4 line-clamp-3">
          {title}
        </h3>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="font-medium text-green-700">{status}</span>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
             </div>
             <span>{condition}</span>
          </div>

          {showLocation && (
             <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{locationString}</span>
             </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
        <QuizTrigger className="w-full sm:w-auto bg-gray-50 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition-all text-center">
          Check Eligibility
        </QuizTrigger>
      </div>
    </div>
  );
}
