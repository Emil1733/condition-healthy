import Link from "next/link";
import { Search, MapPin, Activity, ChevronRight, Home } from "lucide-react";

export default function NotFound() {
  const conditions = [
    { name: "Psoriasis", slug: "psoriasis", color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Diabetes", slug: "diabetes", color: "text-green-600", bg: "bg-green-50" },
    { name: "Migraine", slug: "migraine", color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Eczema", slug: "eczema", color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Arthritis", slug: "arthritis", color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center">
        {/* Visual Cue */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 scale-150 animate-pulse"></div>
            <div className="relative bg-white border border-gray-100 p-6 rounded-3xl shadow-xl">
              <Activity className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-500 mb-12">
          The clinical trial you are looking for may have expired or moved. Explore our active research directories below to find paid studies near you.
        </p>

        {/* Dynamic Navigation Hubs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-12">
          {conditions.map((cond) => (
            <Link 
              key={cond.slug} 
              href={`/trials/${cond.slug}`}
              className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`${cond.bg} p-2.5 rounded-xl`}>
                  <Activity className={`w-5 h-5 ${cond.color}`} />
                </div>
                <span className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {cond.name} Trials
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
          
          <Link 
            href="/"
            className="group flex items-center justify-between p-4 rounded-2xl bg-gray-900 border border-transparent hover:bg-gray-800 transition-all sm:col-span-2"
          >
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/10 p-2.5 rounded-xl text-white">
                <Home className="w-5 h-5" />
              </div>
              <span className="font-bold">Return to Search Homepage</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-400">
          Need immediate assistance? <Link href="/contact" className="text-blue-600 hover:underline font-medium">Contact our clinical support team</Link>.
        </p>
      </div>
    </main>
  );
}
