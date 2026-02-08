
import Link from "next/link";
import { Search, MapPin, Activity, ChevronRight } from "lucide-react";
import TrustBar from "@/components/TrustBar";
import HeroSearch from "@/components/HeroSearch";
import { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Find Paid Clinical Trials Near You | ${SITE_CONFIG.brandingSuffix}`,
  description: `Find high-paying clinical research studies and advanced treatment options near you. Access new medical care and earn compensation at no cost to you via ${SITE_CONFIG.brandingSuffix}.`,
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Find <span className="text-blue-700">Clinical Trials</span> Near You.
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
             Get access to advanced medical treatments and earn compensation up to $1,200/visit. No insurance required.
          </p>



// ... inside the component ...
          {/* Search Bar Visual */}
          <HeroSearch />
          
          <TrustBar />
        </div>
      </section>

      {/* Popular locations (For Testing) */}
      <section className="py-20 max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Research Studies</h2>
            <p className="text-gray-500">Select a condition to find trials in your area</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Direct Links to our pSEO engine hubs */}
            <div className="space-y-4">
              <Link href="/trials/psoriasis/austin-tx" className="group block">
                  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group-hover:border-blue-200">
                      <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100">
                          <Activity className="text-blue-600 w-6 h-6" aria-hidden="true" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-700">Psoriasis in Austin</h3>
                      <p className="text-sm text-gray-500">Recruiting • Up to $1,200</p>
                  </div>
              </Link>
              <Link href="/trials/psoriasis" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2">
                View all Psoriasis trials <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              <Link href="/trials/diabetes/houston-tx" className="group block">
                  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group-hover:border-blue-200">
                      <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100">
                          <Activity className="text-green-600 w-6 h-6" aria-hidden="true" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-green-700">Diabetes in Houston</h3>
                      <p className="text-sm text-gray-500">Recruiting • Up to $2,500</p>
                  </div>
              </Link>
              <Link href="/trials/diabetes" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2">
                View all Diabetes trials <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              <Link href="/trials/migraine/dallas-tx" className="group block">
                  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group-hover:border-blue-200">
                      <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-100">
                          <Activity className="text-purple-600 w-6 h-6" aria-hidden="true" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-purple-700">Migraine in Dallas</h3>
                      <p className="text-sm text-gray-500">Recruiting • Up to $800</p>
                  </div>
              </Link>
              <Link href="/trials/migraine" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2">
                View all Migraine trials <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
         </div>
      </section>

    </main>
  );
}
