import React from 'react';
import { FaDatabase, FaCookie, FaShare, FaLock, FaUserSecret, FaEnvelope } from 'react-icons/fa';

const PrivacyPage = () => {
  const lastUpdated = 'March 15, 2026';

  const sections = [
    {
      icon: <FaDatabase className="text-2xl" />,
      title: 'Information We Collect',
      items: [
        'Personal identification information (Name, email address, phone number)',
        'Delivery address and location data',
        'Order history and preferences',
        'Payment information (processed securely by third-party providers)',
        'Device information (IP address, browser type, device type)'
      ]
    },
    {
      icon: <FaCookie className="text-2xl" />,
      title: 'Cookies and Tracking',
      items: [
        'We use cookies to enhance your experience',
        'Analytics cookies to understand how you use our service',
        'Essential cookies for basic functionality',
        'You can control cookies through browser settings'
      ]
    },
    {
      icon: <FaShare className="text-2xl" />,
      title: 'How We Use Your Information',
      items: [
        'Process and deliver your orders',
        'Send you order confirmations and updates',
        'Improve our products and services',
        'Personalize your experience',
        'Communicate with you about promotions (with your consent)'
      ]
    },
    {
      icon: <FaLock className="text-2xl" />,
      title: 'Data Security',
      items: [
        'We implement industry-standard security measures',
        'Your data is encrypted in transit and at rest',
        'Regular security audits and monitoring',
        'Access to personal data is restricted to authorized personnel only'
      ]
    },
    {
      icon: <FaUserSecret className="text-2xl" />,
      title: 'Your Rights',
      items: [
        'Access your personal data',
        'Correct inaccurate information',
        'Request deletion of your data',
        'Opt-out of marketing communications',
        'Data portability'
      ]
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
      
      <div className="flex justify-end mb-6">
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs sm:text-sm">
          Last Updated: {lastUpdated}
        </span>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500">
                {section.icon}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{section.title}</h2>
            </div>
            <ul className="space-y-2 ml-4">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600">
                  <span className="text-red-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* GDPR/CCPA Notice */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">GDPR & CCPA Compliance</h3>
          <p className="text-sm text-gray-600">
            If you are a resident of the European Economic Area (EEA) or California, you have additional rights under GDPR and CCPA. Please contact us to exercise these rights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;