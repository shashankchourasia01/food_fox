import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaUser, FaCreditCard, FaShieldAlt } from 'react-icons/fa';

const TermsPage = () => {
  const lastUpdated = 'March 15, 2026';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
      
      {/* Last Updated Badge */}
      <div className="flex justify-end mb-6">
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs sm:text-sm">
          Last Updated: {lastUpdated}
        </span>
      </div>

      {/* Welcome Note */}
      <div className="prose max-w-none">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">1. Introduction</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Welcome to FlavorFix ("Company", "we", "our", "us")! These Terms and Conditions ("Terms") govern your use of our website, mobile application, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access our Services.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">2. Definitions</h2>
        <ul className="space-y-3 mb-6">
          <li className="flex gap-3">
            <span className="font-bold text-red-500 min-w-25">"Account"</span>
            <span className="text-gray-600">means a unique account created for you to access our Services.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-red-500 min-w-25">"Order"</span>
            <span className="text-gray-600">means a request to purchase food items from us.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-red-500 min-w-25">"Service"</span>
            <span className="text-gray-600">refers to the FlavorFix website and food delivery services.</span>
          </li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">3. User Accounts</h2>
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-gray-700 mb-3">
            When you create an account with us, you guarantee that:
          </p>
          <ul className="space-y-2">
            {[
              'You are at least 18 years old',
              'The information you provide is accurate and complete',
              'You will maintain the security of your account',
              'You will notify us immediately of any unauthorized use',
              'You are responsible for all activities under your account'
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">4. Orders and Payments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaCreditCard className="text-red-500 text-xl" />
              <h3 className="font-semibold">Payment Methods</h3>
            </div>
            <p className="text-sm text-gray-600">
              We accept Cash on Delivery (COD), Credit/Debit Cards, UPI, and major wallets.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-red-500 text-xl" />
              <h3 className="font-semibold">Security</h3>
            </div>
            <p className="text-sm text-gray-600">
              All payments are processed securely. We do not store your payment information.
            </p>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">5. Prohibited Activities</h2>
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <ul className="space-y-2">
            {[
              'Using our Services for any illegal purpose',
              'Attempting to interfere with the proper working of the Service',
              'Bypassing any measures we may use to prevent access',
              'Impersonating any person or entity',
              'Harassing, abusing, or harming others'
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <FaTimesCircle className="text-red-500 mt-1 shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">6. Intellectual Property</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          The Service and its original content, features, and functionality are and will remain the exclusive property of FlavorFix and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">7. Termination</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">8. Limitation of Liability</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          In no event shall FlavorFix, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">9. Changes to Terms</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">10. Contact Us</h2>
        <p className="text-gray-600 mb-2">If you have any questions about these Terms, please contact us:</p>
        <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
          <li>By email: legal@flavorfix.com</li>
          <li>By phone: +91 9304637399</li>
          <li>By mail: Jayanagar, Bangalore - 560041</li>
        </ul>
      </div>
    </div>
  );
};

export default TermsPage;