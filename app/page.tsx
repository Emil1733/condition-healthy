
import Link from "next/link";
import { Search, MapPin, Activity } from "lucide-react";
import TrustBar from "@/components/TrustBar";

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

          {/* Search Bar Visual */}
          <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 max-w-xl mx-auto flex items-center gap-2 mb-12 transform hover:scale-[1.01] transition-all">
             <MapPin className="w-6 h-6 text-gray-400 ml-4" />
             <input 
                type="text" 
                placeholder="Enter your Zip Code (e.g., 78701)" 
                className="flex-1 p-3 outline-none text-gray-700 font-medium placeholder-gray-400"
             />
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
                Search
             </button>
          </div>
          
          <TrustBar />
        </div>
      </section>

      {/* Popular locations (For Testing) */}
      <section className="py-20 max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Popular Research Studies</h2>
            <p className="text-gray-500">Select a location to see active trials</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Direct Links to our pSEO engine */}
            <Link href="/trials/psoriasis/austin-tx" className="group block">
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group-hover:border-blue-200">
                    <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100">
                        <Activity className="text-blue-600 w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-700">Psoriasis in Austin</h3>
                    <p className="text-sm text-gray-500">Recruiting • Up to $1,200</p>
                </div>
            </Link>

            <Link href="/trials/diabetes/houston-tx" className="group block">
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group-hover:border-blue-200">
                    <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100">
                        <Activity className="text-green-600 w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-green-700">Diabetes in Houston</h3>
                    <p className="text-sm text-gray-500">Recruiting • Up to $2,500</p>
                </div>
            </Link>

            <Link href="/trials/migraine/dallas-tx" className="group block">
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group-hover:border-blue-200">
                    <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-100">
                        <Activity className="text-purple-600 w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-purple-700">Migraine in Dallas</h3>
                    <p className="text-sm text-gray-500">Recruiting • Up to $800</p>
                </div>
            </Link>
         </div>
      </section>

    </main>
  );
}
