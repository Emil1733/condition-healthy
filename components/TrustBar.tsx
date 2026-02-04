"use client";

import { ShieldCheck, Lock, FileCheck } from "lucide-react";

export default function TrustBar() {
  return (
    <div className="w-full bg-gray-50 border-t border-b border-gray-200 py-4">
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16 px-4">
        {/* Signal 1: FDA */}
        <div className="flex items-center space-x-2 text-gray-600">
          <FileCheck className="w-6 h-6 text-blue-700" />
          <span className="font-semibold text-sm md:text-base">FDA Guidelines Monitored</span>
        </div>

        {/* Signal 2: HIPAA */}
        <div className="flex items-center space-x-2 text-gray-600">
          <ShieldCheck className="w-6 h-6 text-blue-700" />
          <span className="font-semibold text-sm md:text-base">HIPAA Compliant Data</span>
        </div>

        {/* Signal 3: Security */}
        <div className="flex items-center space-x-2 text-gray-600">
          <Lock className="w-6 h-6 text-blue-700" />
          <span className="font-semibold text-sm md:text-base">256-bit SSL Enrollment</span>
        </div>
      </div>
    </div>
  );
}
