import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function FactCheckingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-8">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <h1 className="text-4xl font-bold">Fact-Checking Policy</h1>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="lead text-xl text-slate-300 mb-8">
            Accuracy is at the core of our mission. Every clinical trial listed on ConditionHealthy is verified against official registries and updated regularly.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Our Verification Process</h2>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li><strong>Source Verification:</strong> We only source data from official government registries (like ClinicalTrials.gov) and verified research institutions.</li>
              <li><strong>Regular Updates:</strong> Our database is synced daily to ensure trial status (Recruiting, Active, Completed) is current.</li>
              <li><strong>Medical Review:</strong> Content regarding medical conditions is reviewed by qualified healthcare professionals.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Corrections</h2>
            <p className="text-slate-300">
              We are committed to correcting errors promptly. If you find inaccurate information on our site, please report it immediately to <br/>
              <span className="text-blue-400">corrections@conditionhealthy.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
