"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    // Redirect to the trials page with the location query
    // We will update /trials/page.tsx to handle this query parameter next
    router.push(`/trials?location=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-white p-1.5 md:p-2 rounded-2xl shadow-xl border border-gray-100 max-w-xl mx-auto flex items-center gap-2 mb-8 md:mb-12 transform hover:scale-[1.01] transition-all relative z-20">
      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-gray-400 ml-2 md:ml-4 flex-shrink-0" aria-hidden="true" />
      <form onSubmit={handleSearch} className="flex-1 flex items-center">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter City or Zip..." 
          className="flex-1 p-2 md:p-3 outline-none text-gray-700 font-medium placeholder-gray-400 min-w-0 text-sm md:text-base bg-transparent"
        />
        <button 
          type="submit"
          disabled={isSearching}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-8 py-2.5 md:py-3 rounded-xl font-bold transition-all flex items-center justify-center min-w-[80px] md:min-w-[120px] text-sm md:text-base mr-1"
        >
          {isSearching ? (
             <span className="animate-pulse">...</span>
          ) : (
             "Search"
          )}
        </button>
      </form>
    </div>
  );
}
