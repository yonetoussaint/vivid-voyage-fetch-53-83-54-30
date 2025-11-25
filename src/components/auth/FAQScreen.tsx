// components/auth/FAQScreen.tsx
import React from 'react';
import { ChevronLeft, X } from 'lucide-react';

interface FAQScreenProps {
  onBack: () => void;
  onClose?: () => void;
  authMethod?: 'email' | 'phone';
  isCompact?: boolean;
}

const FAQScreen: React.FC<FAQScreenProps> = ({ 
  onBack, 
  onClose, 
  authMethod = 'email',
  isCompact = false 
}) => {
  const faqs = [
    {
      question: "I didn't receive my verification code",
      answer: authMethod === 'email' 
        ? "Check your spam folder, ensure you entered the correct email address, or request a new code. Codes typically arrive within 2-5 minutes."
        : "Ensure you entered the correct phone number with country code. Request a new code if it doesn't arrive within 2 minutes."
    },
    {
      question: "The verification code isn't working",
      answer: "Codes expire after 15 minutes. Make sure you're entering the most recent code sent to you. If it still doesn't work, request a new code."
    },
    {
      question: "I'm having trouble signing in",
      answer: "Ensure you're using the correct email/phone and password. If you forgot your password, use the 'Forgot Password' option to reset it."
    },
    {
      question: "The page isn't loading properly",
      answer: "Try refreshing the page, clearing your browser cache, or using a different browser. Ensure you have a stable internet connection."
    },
    {
      question: "I can't create a new account",
      answer: "Make sure you're using a valid email address and that you don't already have an account with that email. Passwords must be at least 8 characters long."
    },
    {
      question: "I need to update my email/phone number",
      answer: "If you can still access your account, you can update your contact information in account settings. Otherwise, contact support for assistance."
    }
  ];

  return (
    <div className={`bg-white ${isCompact ? 'rounded-lg' : 'min-h-screen'} flex flex-col`}>
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Help & Support</h1>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2 ml-11">
          Find answers to common questions and issues
        </p>
      </div>

      {/* FAQ Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Additional Help Section */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Still need help?</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Contact Support
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQScreen;