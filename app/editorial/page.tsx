import { ShieldCheck } from "lucide-react";

export default function EditorialStandardsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">Editorial Standards</h1>
        </div>

        <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
          <p className="text-xl font-medium mb-6">www.ConditionHealthy.com is committed to providing accurate, reliable, and unbiased information about clinical trials.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Integrity Commitment</h2>
          <p className="mb-6">Every clinical study listed on our platform is sourced directly from clinical research organizations (CROs) or the official ClinicalTrials.gov registry. We prioritize active, recruiting studies to ensure our users have access to real healthcare opportunities.</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Accuracy</h2>
          <p className="mb-6">Our automated "Hydra" content engine synthesizes clinical data with local environmental factors. This content is periodically reviewed by our platform administrators to ensure it maintains the highest standards of scientific and grammatical accuracy.</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Transparency</h2>
          <p>We are a free service for patients. We are funded by research organizations who pay for help connecting with qualified study participants. This funding never influences which studies we show you—we show all relevant studies based on your search criteria.</p>
        </div>
      </div>
    </main>
  );
}
