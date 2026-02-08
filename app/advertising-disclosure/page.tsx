import Link from "next/link";
import { ArrowLeft, Megaphone } from "lucide-react";

export default function AdvertisingDisclosurePage() {
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
            <Megaphone className="w-12 h-12 text-yellow-500" />
            <h1 className="text-4xl font-bold">Advertising Disclosure</h1>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="lead text-xl text-slate-300 mb-8">
            Transparency is key to trust. ConditionHealthy is free for patients because we may earn revenue through partnerships with research organizations.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">How We Make Money</h2>
            <p className="text-slate-300">
              ConditionHealthy may receive a referral fee when a user successfully enrolls in a clinical trial through our platform. This allows us to maintain our directory and services at no cost to patients.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Editorial Independence</h2>
            <p className="text-slate-300">
              Our revenue model does not influence our editorial content or the search results you see. Clinical trials are ranked based on relevance to your search and location, not by sponsorship, unless explicitly labeled as "Sponsored."
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Partners</h2>
            <p className="text-slate-300">
              We vet all our partners to ensure they meet high ethical and safety standards for clinical research.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
