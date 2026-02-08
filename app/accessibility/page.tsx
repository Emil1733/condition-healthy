import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Accessibility Statement</h1>
        <div className="prose prose-invert max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Our Commitment</h2>
            <p className="text-slate-300">
              ConditionHealthy is dedicated to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Conformance Status</h2>
            <p className="text-slate-300">
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. 
              It defines three levels of conformance: Level A, Level AA, and Level AAA. 
              ConditionHealthy strives to be fully conformant with <strong>WCAG 2.1 Level AA</strong>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Accessibility Features</h2>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li><strong>Semantic HTML:</strong> We use proper heading structures and semantic elements to support screen readers.</li>
              <li><strong>Color Contrast:</strong> We maintain high color contrast ratios for text visibility.</li>
              <li><strong>Keyboard Navigation:</strong> Our interactive elements are designed to be navigable via keyboard.</li>
              <li><strong>Alt Text:</strong> Images include descriptive alternative text.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Feedback</h2>
            <p className="text-slate-300">
              We welcome your feedback on the accessibility of ConditionHealthy. Please let us know if you encounter accessibility barriers: <br/>
              <span className="text-blue-400">accessibility@conditionhealthy.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
