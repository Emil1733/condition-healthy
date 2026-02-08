import { ShieldCheck, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
        </div>

        <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
          <p className="text-xl font-medium mb-6">We protect your medical search privacy as if it were our own.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
          <p className="mb-6">We only collect information you voluntarily provide during the pre-screening quiz, such as your email address and general health status, for the purpose of connecting you with clinical research specialists.</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Usage</h2>
          <p className="mb-6">Your data is only shared with the research site or organization conducting the specific study you expressed interest in. We never sell your personal information to third-party data brokers.</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Standards</h2>
          <p>All data is transmitted via HIPAA-compliant SSL encryption and stored in secure, private database environments with limited access controls.</p>
        </div>
      </div>
    </main>
  );
}
