
import { SITE_CONFIG } from "@/lib/constants";
import { Activity, ChevronRight, MapPin, ShieldCheck, Search } from "lucide-react";
import Link from "next/link";
import TrustBar from "@/components/TrustBar";

export const metadata = {
  title: `Browse Clinical Trials by Medical Condition | ${SITE_CONFIG.brandingSuffix}`,
  description: `Access our complete directory of paid clinical trials. Browse high-paying research studies for over 20+ medical conditions across the United States via ${SITE_CONFIG.brandingSuffix}.`,
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/trials`,
  },
};

const CONDITIONS = [
  { name: "Psoriasis", slug: "psoriasis", count: 124, icon: "Skin", color: "blue" },
  { name: "Diabetes", slug: "diabetes", count: 89, icon: "Activity", color: "green" },
  { name: "Migraine", slug: "migraine", count: 62, icon: "Brain", color: "purple" },
  { name: "Eczema", slug: "eczema", count: 45, icon: "Shield", color: "orange" },
  { name: "Arthritis", slug: "arthritis", count: 78, icon: "User", color: "red" },
];

import Script from "next/script";

export default function TrialsDirectoryPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumb Schema */}
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": SITE_CONFIG.baseUrl
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "All Research Trials",
              "item": `${SITE_CONFIG.baseUrl}/trials`
            }
          ]
        })}
      </Script>
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 pt-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* UI Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-12">
                <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">All Research Trials</span>
            </nav>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <Activity className="w-4 h-4" />
                2026 Clinical Research Directory
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                Browse Trials by <span className="text-blue-600">Medical Condition</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Find the right clinical study for your needs. Browse our categorical directory to find local treatments, expert care, and compensation near you.
              </p>
            </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CONDITIONS.map((cond) => (
            <Link 
              key={cond.slug}
              href={`/trials/${cond.slug}`}
              className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-xl transition-all relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50/50 to-transparent rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform`} />
              
              <div className="relative z-10">
                <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                  <Activity className="w-7 h-7" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {cond.name}
                </h2>
                
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                  Join advanced {cond.name} research studies. Access new treatments and earn compensation up to $1,500.
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {cond.count} Active Trials Found
                  </span>
                  <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <TrustBar />

      {/* SEO Footer Content */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Participate in Clinical Research?</h2>
            <div className="grid md:grid-cols-3 gap-12 text-left">
                <div>
                   <h3 className="font-bold text-blue-700 mb-2">Advanced Care</h3>
                   <p className="text-sm text-gray-600 leading-relaxed italic">Access investigational treatments before they are widely available to the public.</p>
                </div>
                <div>
                   <h3 className="font-bold text-blue-700 mb-2">Expert Oversight</h3>
                   <p className="text-sm text-gray-600 leading-relaxed italic">Receive medical care from leading specialists and research teams at no cost.</p>
                </div>
                <div>
                   <h3 className="font-bold text-blue-700 mb-2">Compensation</h3>
                   <p className="text-sm text-gray-600 leading-relaxed italic">Many studies provide financial compensation for your time and travel expenses.</p>
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}
