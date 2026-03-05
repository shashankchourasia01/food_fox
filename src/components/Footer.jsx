import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaHeart
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
      
      {/* Small Decorative Line at Top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
      
      {/* Curved Shape at Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden opacity-30">
        <svg className="relative block w-full h-8 md:h-10" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                fill="currentColor" 
                className="text-red-500">
          </path>
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-16 pb-6 relative z-10">
        
        {/* Top Section - Company Name */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <MdRestaurantMenu className="text-2xl md:text-3xl text-red-400" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-300 to-orange-300 text-transparent bg-clip-text">
              FlavorFix
            </h2>
            <MdRestaurant className="text-2xl md:text-3xl text-orange-400" />
          </div>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-xs md:text-sm leading-relaxed">
            Elevating mobile dining with artisanal flavors delivered with precision and speed.
          </p>
        </div>

        {/* Social Media Handles */}
        <div className="flex justify-center gap-3 mb-8">
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-8 h-8 md:w-9 md:h-9 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition transform hover:scale-110 shadow-lg"
          >
            <FaFacebookF className="text-white text-sm md:text-base" />
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-8 h-8 md:w-9 md:h-9 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition transform hover:scale-110 shadow-lg"
          >
            <FaTwitter className="text-white text-sm md:text-base" />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-8 h-8 md:w-9 md:h-9 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition transform hover:scale-110 shadow-lg"
          >
            <FaInstagram className="text-white text-sm md:text-base" />
          </a>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-8 h-8 md:w-9 md:h-9 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition transform hover:scale-110 shadow-lg"
          >
            <FaYoutube className="text-white text-sm md:text-base" />
          </a>
        </div>

        {/* Links Grid - Discover (Left) & Support (Right) - Mobile par bhi left/right */}
        <div className="flex flex-row justify-between items-start max-w-3xl mx-auto mb-8 gap-4">
          
          {/* Discover Section - Left */}
          <div className="text-left w-1/2">
            <h3 className="text-base md:text-lg font-bold mb-3 text-red-400 border-b-2 border-red-500 inline-block pb-1">
              DISCOVER
            </h3>
            <ul className="space-y-2 mt-3">
              <li>
                <Link to="/trending" className="text-gray-400 hover:text-red-400 transition text-xs md:text-sm block">
                  Trending Now
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-gray-400 hover:text-red-400 transition text-xs md:text-sm block">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/exclusive-partners" className="text-gray-400 hover:text-red-400 transition text-xs md:text-sm block">
                  Exclusive Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section - Right */}
          <div className="text-right w-1/2">
            <h3 className="text-base md:text-lg font-bold mb-3 text-red-400 border-b-2 border-red-500 inline-block pb-1">
              SUPPORT
            </h3>
            <ul className="space-y-2 mt-3">
              <li>
                <Link to="" className="text-gray-400 hover:text-red-400 transition text-xs md:text-sm block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-red-400 transition text-xs md:text-sm block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-red-400 transition text-xs md:text-sm block">
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Delivery Badge */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <MdDeliveryDining className="text-red-400 text-lg" />
          <span className="text-xs text-gray-500">Fast Delivery • 24/7 Service</span>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white border-opacity-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>© {currentYear}</span>
              <span className="font-semibold text-red-400">FLAVORFIX TECH INC.</span>
              <span>All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Made with</span>
              <FaHeart className="text-red-500 mx-1" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Shape */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180 opacity-20">
        <svg className="relative block w-full h-6 md:h-8" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                fill="currentColor" 
                className="text-red-500">
          </path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;