import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaMoneyBillWave, FaQuestionCircle } from 'react-icons/fa';

const RefundPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const policies = [
    {
      title: 'Order Cancellation',
      timeline: 'Before Preparation',
      refund: '100% Refund',
      description: 'Cancel within 5 minutes of placing order for full refund.',
      icon: <FaCheckCircle className="text-green-500" />
    },
    {
      title: 'Order Cancellation',
      timeline: 'After Preparation',
      refund: 'No Refund',
      description: 'Cancellation after preparation cannot be refunded.',
      icon: <FaTimesCircle className="text-red-500" />
    },
    {
      title: 'Delivery Delay',
      timeline: '> 60 minutes',
      refund: '100% Refund',
      description: 'Full refund if delivery takes more than 60 minutes.',
      icon: <FaClock className="text-orange-500" />
    },
    {
      title: 'Wrong/Damaged Items',
      timeline: 'Report within 30 mins',
      refund: 'Replacement/Refund',
      description: 'Report issues immediately for resolution.',
      icon: <FaMoneyBillWave className="text-blue-500" />
    }
  ];

  const faqs = [
    {
      q: 'How do I request a refund?',
      a: 'Contact our support team within 30 minutes of delivery via WhatsApp or email with your order ID and photos of the issue.'
    },
    {
      q: 'How long does refund take?',
      a: 'Refunds are processed within 5-7 business days after approval. COD orders are refunded via bank transfer.'
    },
    {
      q: 'Can I cancel my order?',
      a: 'Yes, within 5 minutes of placing order. After that, if preparation hasn\'t started, we may still accommodate.'
    },
    {
      q: 'What if food quality is bad?',
      a: 'We take quality seriously. Report within 30 minutes of delivery for investigation and appropriate action.'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
      
      {/* Summary Card */}
      <div className="bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2">Our Refund Promise</h2>
        <p className="opacity-90">
          Customer satisfaction is our priority. We strive to resolve any issues quickly and fairly.
        </p>
      </div>

      {/* Policy Grid */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Refund & Cancellation Policy</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {policies.map((policy, idx) => (
          <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{policy.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{policy.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">{policy.timeline}</span> • {policy.refund}
                </p>
                <p className="text-xs text-gray-500 mt-2">{policy.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Process Steps */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Refund Process</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex-1 text-center">
            <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center font-bold mx-auto mb-2">
              {step}
            </div>
            <p className="text-sm font-medium">
              {step === 1 && 'Report Issue'}
              {step === 2 && 'Investigation'}
              {step === 3 && 'Approval'}
              {step === 4 && 'Refund Processed'}
            </p>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
            >
              <span className="font-medium text-gray-800">{faq.q}</span>
              <FaQuestionCircle className={`text-gray-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
            </button>
            {activeFaq === idx && (
              <div className="p-4 bg-gray-50 border-t">
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 text-xs text-gray-400 border-t pt-4">
        <p>
          * All refunds are subject to verification. FlavorFix reserves the right to refuse refunds in case of abuse or fraudulent claims.
        </p>
      </div>
    </div>
  );
};

export default RefundPage;