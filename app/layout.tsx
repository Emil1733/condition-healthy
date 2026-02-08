import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { SITE_CONFIG } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConditionHealthy.com | Clinical Trial Finder",
  description: "Find high-paying clinical research studies and advanced treatment options near you.",
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation / Header */}
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex-shrink-0 flex items-center gap-1 hover:opacity-90 transition-opacity">
                  <span className="font-extrabold text-2xl text-gray-900 tracking-tight font-sans">Condition</span>
                  <span className="font-light text-2xl text-blue-600 tracking-widest uppercase ml-1 font-sans">Healthy</span>
                </Link>
              </div>
              <div className="flex items-center gap-6">
                 <Link href="/trials" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors hidden sm:block">
                    Browse Trials
                 </Link>
                 <span className="text-sm font-medium text-gray-400 hidden lg:block">
                    Connecting Patients & Research
                 </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {children}

        {/* Medical Footer (Elite YMYL Compliance) */}
        <footer className="bg-gray-950 text-gray-400 py-16 mt-20 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    
                    {/* Brand & Mission */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-blue-600 p-1 rounded">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg text-white">ConditionHealthy</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            A global research network dedicated to connecting patients with life-changing clinical trials through data transparency and empathetic care.
                        </p>
                    </div>

                    {/* Editorial & Trust */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Editorial Policy</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/medical-review" className="hover:text-blue-400 transition">Medical Review Process</Link></li>
                            <li><Link href="/editorial" className="hover:text-blue-400 transition">Editorial Standards</Link></li>
                            <li><Link href="/fact-checking" className="hover:text-blue-400 transition">Fact-Checking Policy</Link></li>
                            <li><Link href="/advertising-disclosure" className="hover:text-blue-400 transition">Advertising Disclosure</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Compliance */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Compliance</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
                            <li><Link href="/hipaa-compliance" className="hover:text-blue-400 transition">HIPAA Compliance</Link></li>
                            <li><Link href="/accessibility" className="hover:text-blue-400 transition">Accessibility Statement</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Verification */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contact</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-[10px] uppercase font-bold">Email</span>
                                <span className="text-gray-300">support@conditionhealthy.com</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-[10px] uppercase font-bold">HQ</span>
                                <span className="text-gray-300">Austin, Texas, USA</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Final Disclaimer */}
                <div className="pt-12 border-t border-gray-800 text-center md:text-left">
                    <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
                        <h4 className="text-gray-300 font-bold mb-3 text-sm flex items-center justify-center md:justify-start gap-2">
                             <ShieldCheck className="w-4 h-4 text-orange-400" />
                             Medical Disclaimer
                        </h4>
                        <p className="text-[12px] leading-relaxed text-gray-500">
                            ConditionHealthy.com is an independent clinical trial directory and is not a medical provider. We do not provide medical advice, diagnosis, or treatment. The information provided on this website is for educational purposes only and should not replace professional medical guidance. 
                            <span className="block mt-2 font-semibold">If you are experiencing a medical emergency, please call 911 or your local emergency services immediately.</span>
                        </p>
                    </div>
                    <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-[11px]">
                            © {new Date().getFullYear()} ConditionHealthy Research Network. All rights reserved worldwide.
                        </p>
                        <div className="flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all">
                             {/* Trust logos placeholders could go here */}
                             <span className="text-[10px] font-bold tracking-widest text-gray-400 border border-gray-700 px-2 py-1 rounded">SSL ENCRYPTED</span>
                             <span className="text-[10px] font-bold tracking-widest text-gray-400 border border-gray-700 px-2 py-1 rounded">HIPAA COMPLIANT</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
      </body>
    </html>
  );
}
