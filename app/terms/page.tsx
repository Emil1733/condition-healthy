import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none">
          <p className="lead">Last Updated: {new Date().getFullYear()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Agreement to Terms</h2>
            <p className="text-slate-300">
              By accessing or using ConditionHealthy.com, you agree to be bound by these Terms of Service. 
              Our platform serves as a directory for clinical trials and research studies. We do not provide medical advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Medical Disclaimer</h2>
            <p className="text-slate-300">
              ConditionHealthy is an informational resource. The content provided is not intended to be a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. User Eligiblity</h2>
            <p className="text-slate-300">
              You must be at least 18 years old to use this service. Any participation in clinical trials found through our directory is subject to the specific eligibility criteria of that study and the discretion of the research team.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Privacy & Data</h2>
            <p className="text-slate-300">
              Your use of ConditionHealthy is also governed by our Privacy Policy. We are committed to protecting your personal information and complying with data protection laws.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
