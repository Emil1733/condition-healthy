"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  Bus, 
  Hospital, 
  Stethoscope, 
  Globe,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import StudyCard from "./StudyCard";

interface StudyTabsProps {
  activeTrials: any[];
  pageContent: any;
  locationTitle: string;
  condition: string;
  stateName: string;
  city: string;
}

export default function StudyTabs({ 
  activeTrials, 
  pageContent, 
  locationTitle, 
  condition, 
  stateName, 
  city 
}: StudyTabsProps) {
  const [activeTab, setActiveTab] = useState("trials");
  const [isScrolled, setIsScrolled] = useState(false);

  // Helper to clean up AI markdown (strip ** and * asterisks)
  const cleanText = (text: string) => {
    if (!text) return "";
    return text.replace(/\*/g, "").replace(/:$/g, "").trim();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tabs = [
    { id: "trials", label: "Active Studies", icon: Activity },
    { id: "guide", label: "Patient Guide", icon: Stethoscope },
    { id: "location", label: "Location Intel", icon: MapPin },
    { id: "faq", label: "Common Questions", icon: FileText },
  ];

  return (
    <div className="relative">
      {/* Sticky Sub-Nav with Scroll Mask */}
      <div className={`sticky top-0 z-40 transition-all duration-500 ${isScrolled ? "bg-white/90 backdrop-blur-2xl border-b border-gray-100 py-2 shadow-sm" : "py-4"}`}>
        <div className="max-w-7xl mx-auto px-4 relative flex items-center justify-between gap-4">
          
          {/* Horizontal Scroll Mask Container */}
          <div className="relative flex-1 overflow-hidden">
             <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1 relative">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-colors duration-300 z-10 ${
                        isActive ? "text-white" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabPill"
                          className="absolute inset-0 bg-blue-600 shadow-lg shadow-blue-200 rounded-full z-0"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <tab.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                        {tab.label}
                      </span>
                    </motion.button>
                  );
                })}
             </div>
             {/* Gradient Fade to indicate horizontal scroll */}
             <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/90 to-transparent pointer-events-none md:hidden" />
          </div>

          <button 
            onClick={() => {
              const { triggerEligibilityQuiz } = require("@/lib/events");
              triggerEligibilityQuiz();
            }}
            className="hidden sm:flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-100"
          >
            Check Eligibility
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === "trials" && (
                <motion.div
                  key="trials"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Available {condition} Opportunities</h2>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">{activeTrials.length} Recruiting</span>
                  </div>
                  
                  {activeTrials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeTrials.map((study: any) => (
                        <StudyCard
                          key={study.nct_id}
                          nctId={study.nct_id}
                          title={study.title}
                          status={study.status}
                          condition={study.condition}
                          city={study.location_city}
                          state={study.location_state}
                          showLocation={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-16 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900">Expanding Search...</h3>
                      <p className="text-gray-500 mt-2">Checking neighboring cities in {stateName}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "guide" && (
                <motion.div
                  key="guide"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm">
                    <div className="max-w-2xl">
                      <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight">Expert Insights on {condition} in {city}</h2>
                      <div className="prose prose-blue text-gray-600 leading-relaxed space-y-6">
                        {cleanText(pageContent?.medical_context)}
                      </div>
                    </div>
                  </section>

                  {pageContent?.environmental_factors && (
                    <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                       <Globe className="absolute -bottom-12 -right-12 w-64 h-64 opacity-10" />
                       <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                         <MapPin className="w-6 h-6 text-blue-300" />
                         Regional Environmental Impact
                       </h3>
                       <p className="text-blue-50 leading-relaxed relative z-10 text-lg">
                         {cleanText(pageContent.environmental_factors)}
                       </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "location" && (
                <motion.div
                  key="location"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                        <Bus className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Transit & Navigation</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {cleanText(pageContent?.transit_logistics || pageContent?.transit_info)}
                      </p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                        <Hospital className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Healthcare Infrastructure</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {cleanText(pageContent?.hospital_context) || "Local research is supported by a network of accredited hospitals and independent clinics."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white">
                     <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                       <CheckCircle2 className="w-6 h-6 text-green-400" />
                       Research Hubs & Facilities
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.isArray(pageContent?.local_facilities) ? (
                          pageContent.local_facilities.map((fac: any, i: number) => (
                            <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                              <div>
                                <div className="font-bold text-sm">{cleanText(fac.name || fac)}</div>
                                <div className="text-[10px] text-blue-400 font-bold uppercase">{cleanText(fac.type)}</div>
                              </div>
                              <MapPin className="w-4 h-4 text-white/20" />
                            </div>
                          ))
                        ) : (
                          <p className="text-white/60 italic text-sm">Loading local facility data...</p>
                        )}
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "faq" && (
                <motion.div
                  key="faq"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black text-gray-900 mb-8">Clinical Research FAQ</h2>
                  {Array.isArray(pageContent?.local_faq) ? (
                    pageContent.local_faq.map((faq: any, i: number) => (
                      <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-3 flex gap-3">
                          <span className="text-blue-600">Q.</span>
                          {cleanText(faq.question)}
                        </h4>
                        <div className="text-sm text-gray-500 pl-7 leading-relaxed">
                          {cleanText(faq.answer)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-400 italic">FAQ data is being compiled for this region.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Patient Safeguards</h3>
              <div className="space-y-6">
                 {[
                   { label: "IRB Oversight", sub: "Ethics Committee Approved", icon: ShieldCheck, color: "text-green-500" },
                   { label: "HIPAA Compliant", sub: "Full Data Privacy", icon: FileText, color: "text-blue-500" },
                   { label: "NIH Standards", sub: "Global Quality Benchmarks", icon: Activity, color: "text-orange-500" }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4">
                     <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                     </div>
                     <div>
                        <div className="font-bold text-sm text-gray-900">{item.label}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase">{item.sub}</div>
                     </div>
                   </div>
                 ))}
              </div>

              <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs text-blue-800 font-medium italic leading-relaxed">
                  "Advancing {condition} research in {city} through safe, transparent, and patient-first clinical trials."
                </p>
              </div>

              <button 
                onClick={() => {
                  const { triggerEligibilityQuiz } = require("@/lib/events");
                  triggerEligibilityQuiz();
                }}
                className="w-full mt-8 bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 hover:scale-[1.02] transition-transform"
              >
                START SCREENING
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
