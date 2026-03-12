import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaFileContract, FaLock, FaMoneyBillWave, FaEnvelope } from 'react-icons/fa';
import { MdPolicy, MdPrivacyTip } from 'react-icons/md';

const PolicyLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { path: '/terms', label: 'Terms & Conditions', icon: <FaFileContract /> },
    { path: '/privacy', label: 'Privacy Policy', icon: <FaLock /> },
    { path: '/refund', label: 'Refund Policy', icon: <FaMoneyBillWave /> },
    { path: '/contact', label: 'Contact Us', icon: <FaEnvelope /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-red-500 to-red-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
          >
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {path === '/terms' && 'Terms & Conditions'}
            {path === '/privacy' && 'Privacy Policy'}
            {path === '/refund' && 'Refund Policy'}
            {path === '/contact' && 'Contact Us'}
          </h1>
          <p className="text-white/80 mt-2 max-w-2xl">
            {path === '/terms' && 'Please read these terms carefully before using our service'}
            {path === '/privacy' && 'How we collect, use, and protect your information'}
            {path === '/refund' && 'Our cancellation and refund guidelines'}
            {path === '/contact' && 'We\'d love to hear from you. Get in touch!'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex overflow-x-auto hide-scrollbar">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 sm:px-6 py-4 text-sm sm:text-base font-medium whitespace-nowrap
                  transition border-b-2
                  ${path === item.path
                    ? 'border-red-500 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-600 hover:text-red-500 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.split(' ')[0]}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PolicyLayout;