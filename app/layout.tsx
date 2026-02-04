import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ShieldCheck } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConditionHealthy.com | Clinical Trial Finder",
  description: "Find high-paying clinical research studies and advanced treatment options near you.",
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
                <div className="flex-shrink-0 flex items-center gap-2">
                  <div className="bg-blue-600 p-1.5 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-xl text-gray-900 tracking-tight">Condition<span className="text-blue-600">Healthy</span></span>
                </div>
              </div>
              <div className="flex items-center">
                 <span className="text-sm font-medium text-gray-500 hidden md:block">
                    Connecting Patients & Research since 2011
                 </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {children}

        {/* Medical Footer (YMYL Compliance) */}
        <footer className="bg-gray-900 text-gray-400 py-12 mt-20 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                     <h4 className="text-white font-bold mb-4">Disclaimer</h4>
                     <p className="text-sm leading-relaxed mb-4">
                        ConditionHealthy.com is not a medical provider. We connect patients with IRB-approved clinical research studies. 
                        We do not provide medical advice, diagnosis, or treatment. 
                        Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                     </p>
                     <p className="text-sm leading-relaxed">
                        If you think you may have a medical emergency, call your doctor or 911 immediately.
                     </p>
                </div>
                <div className="flex flex-col md:items-end">
                    <h4 className="text-white font-bold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-right">
                        <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white transition">Do Not Sell My Info</a></li>
                    </ul>
                    <p className="mt-8 text-xs text-gray-600">
                        © {new Date().getFullYear()} ConditionHealthy. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
      </body>
    </html>
  );
}
