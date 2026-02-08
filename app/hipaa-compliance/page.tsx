import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function HipaaPage() {
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
            <ShieldCheck className="w-12 h-12 text-blue-500" />
            <h1 className="text-4xl font-bold">HIPAA Compliance</h1>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="lead text-xl text-slate-300 mb-8">
            ConditionHealthy is committed to protecting the privacy and security of your health information in accordance with the Health Insurance Portability and Accountability Act (HIPAA).
          </p>

          <section className="mb-8 p-6 bg-slate-900 rounded-xl border border-slate-800">
            <h2 className="text-2xl font-semibold mb-4 text-white">Data Security Measures</h2>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using industry-standard SSL/TLS protocols.</li>
              <li><strong>Access Controls:</strong> Strict access controls are in place to limit data access to authorized personnel only.</li>
              <li><strong>Secure Storage:</strong> Sensitive data is stored in secure, HIPAA-compliant hosting environments.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Your Rights</h2>
            <p className="text-slate-300">
              Under HIPAA, you have specific rights regarding your health information, including the right to access, correct, and request deletion of your data. 
              While ConditionHealthy primarily acts as a directory, any personal information you provide for matching purposes is handled with the strict standards required for Protected Health Information (PHI).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Contact Our Privacy Officer</h2>
            <p className="text-slate-300">
              If you have any questions or concerns about our HIPAA compliance or data privacy practices, please contact us at: <br/>
              <span className="text-blue-400">compliance@conditionhealthy.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
