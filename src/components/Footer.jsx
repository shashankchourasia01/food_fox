import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaHeart,
  FaUtensils
} from 'react-icons/fa';
import { 
  MdRestaurant, 
  MdDeliveryDining,
  MdRestaurantMenu 
} from 'react-icons/md';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white overflow-hidden">
      
      {/* Decorative Shapes */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-red-500 to-orange-500 transform -skew-y-1"></div>
      
      {/* Curved Shape at Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-12 md:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                fill="currentColor" 
                className="text-red-500 opacity-20">
          </path>
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-20 pb-8 relative z-10">
        
        {/* Top Section - Company Name with Chef Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            {/* Using MdRestaurantMenu as chef hat alternative */}
            <MdRestaurantMenu className="text-4xl md:text-5xl text-red-400 animate-bounce-slow" />
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-300 to-orange-300 text-transparent bg-clip-text">
              FlavorFix
            </h2>
            <MdRestaurant className="text-4xl md:text-5xl text-orange-400 animate-pulse" />
          </div>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Elevating mobile dining with artisanal flavors delivered with precision and speed.
          </p>
        </div>

        {/* Social Media Handles */}
        <div className="flex justify-center gap-4 mb-12">
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-10 hover:bg-red-500 rounded-full flex items-center justify-center transition transform hover:scale-110 hover:rotate-6"
          >
            <FaFacebookF className="text-white text-lg md:text-xl" />
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-10 hover:bg-red-500 rounded-full flex items-center justify-center transition transform hover:scale-110 hover:rotate-6"
          >
            <FaTwitter className="text-white text-lg md:text-xl" />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-10 hover:bg-red-500 rounded-full flex items-center justify-center transition transform hover:scale-110 hover:rotate-6"
          >
            <FaInstagram className="text-white text-lg md:text-xl" />
          </a>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-10 hover:bg-red-500 rounded-full flex items-center justify-center transition transform hover:scale-110 hover:rotate-6"
          >
            <FaYoutube className="text-white text-lg md:text-xl" />
          </a>
        </div>

        {/* Links Grid - Discover & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
          
          {/* Discover Section */}
          <div className="text-center md:text-right">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-red-400 inline-block border-b-2 border-red-500 pb-2">
              DISCOVER
            </h3>
            <ul className="space-y-3 mt-4">
              <li>
                <Link to="/trending" className="text-gray-300 hover:text-red-400 transition flex items-center justify-center md:justify-end gap-2 group">
                  <span>Trending Now</span>
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-gray-300 hover:text-red-400 transition flex items-center justify-center md:justify-end gap-2 group">
                  <span>New Arrivals</span>
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                </Link>
              </li>
              <li>
                <Link to="/exclusive-partners" className="text-gray-300 hover:text-red-400 transition flex items-center justify-center md:justify-end gap-2 group">
                  <span>Exclusive Partners</span>
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-red-400 inline-block border-b-2 border-red-500 pb-2">
              SUPPORT
            </h3>
            <ul className="space-y-3 mt-4">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-red-400 transition flex items-center justify-center md:justify-start gap-2 group">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                  <span>Help Center</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-red-400 transition flex items-center justify-center md:justify-start gap-2 group">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-red-400 transition flex items-center justify-center md:justify-start gap-2 group">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                  <span>Terms & Privacy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Delivery Badge */}
        <div className="flex justify-center items-center gap-2 mb-8">
          <MdDeliveryDining className="text-red-400 text-2xl animate-bounce" />
          <span className="text-sm text-gray-300">Fast Delivery • 24/7 Service</span>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white border-opacity-20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span>© {currentYear}</span>
              <span className="font-semibold text-red-400">FLAVORFIX TECH INC.</span>
              <span>All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span>Made with</span>
              <FaHeart className="text-red-500 animate-pulse mx-1" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Shape */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180">
        <svg className="relative block w-full h-8 md:h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                fill="currentColor" 
                className="text-red-500 opacity-10">
          </path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;