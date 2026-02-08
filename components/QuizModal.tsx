"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight, ShieldCheck } from "lucide-react";

import { submitLead } from "@/app/actions/leads";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  condition: string;
  city: string; // Added city prop
}

export default function QuizModal({ isOpen, onClose, condition, city }: QuizModalProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAnswer = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
    setStep(step + 1);
  };

  const handleSubmitEmail = async () => {
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    const result = await submitLead({
      email,
      condition,
      city,
      answers,
    });

    if (result.success) {
      setIsSuccess(true);
      // Wait bit then close or show final success
      setTimeout(() => {
        onClose();
        setStep(0);
        setIsSuccess(false);
        setEmail("");
      }, 3000);
    } else {
      alert("Something went wrong. Please try again.");
    }
    setIsSubmitting(false);
  };

  const questions = [
    {
      id: "location",
      text: "Do you currently live in the United States?",
      options: ["Yes", "No"],
    },
    {
      id: "age",
      text: "Are you between the ages of 18 and 65?",
      options: ["Yes", "No"],
    },
    {
      id: "diagnosis",
      text: `Have you been diagnosed with ${condition}?`,
      options: ["Yes", "No", "Not sure"],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2">
          <div
            className="bg-blue-600 h-2 transition-all duration-500"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>

        <div className="p-8 relative min-h-[400px] flex flex-col justify-center">
            
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>

          <AnimatePresence mode="wait">
            {step < questions.length ? (
              <motion.div
                key={step}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-tight">
                  {questions[step].text}
                </h2>
                <div className="space-y-4">
                  {questions[step].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(questions[step].id, option)}
                      className="w-full text-left px-6 py-4 rounded-xl border-2 border-gray-100 hover:border-blue-600 hover:bg-blue-50 transition-all flex justify-between items-center group"
                    >
                      <span className="text-lg font-medium text-gray-700 group-hover:text-blue-700">
                        {option}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Success / Email Capture Step */
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                {isSuccess ? (
                  <>
                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h2>
                    <p className="text-gray-600">
                      A research specialist will contact you shortly with matching trials.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Great News!</h2>
                    <p className="text-gray-600 mb-8">
                      You qualify for the <b>{condition}</b> study in <b>{city}</b>. Enter your email to see the clinic details.
                    </p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 outline-none"
                    />
                    <button 
                      onClick={handleSubmitEmail}
                      disabled={isSubmitting || !email}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Processing..." : "See Matching Trials"}
                    </button>
                  </>
                )}

                {/* Security Signal Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  Secure & Encrypted 256-bit Connection
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
