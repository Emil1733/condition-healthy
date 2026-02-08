import { ShieldCheck, ClipboardCheck } from "lucide-react";

export default function MedicalReviewPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-xl">
            <ClipboardCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">Medical Review Process</h1>
        </div>

        <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
          <p className="text-xl font-medium mb-6">Ensuring the clinical accuracy of research listings is our top priority.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sourcing</h2>
          <p className="mb-6">We provide a direct conduit to official clinical trial data. All study details, including phase, enrollment criteria, and primary endpoints, are pulled directly from trial sponsors or federal registries.</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility Logic</h2>
          <p className="mb-6">Our pre-screening quiz logic is designed based on standard Phase II and Phase III inclusion/exclusion criteria. While we do not provide medical diagnosis, we help patients understand their preliminary fit for a specific research protocol.</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Medical Advice</h2>
          <p>Important: ConditionHealthy.com is an information directory. Participation in a clinical trial should only be decided in consultation with your primary healthcare provider. We do not recommend or endorse specific treatments.</p>
        </div>
      </div>
    </main>
  );
}
