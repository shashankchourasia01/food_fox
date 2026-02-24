import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaMotorcycle, FaClock, FaChevronRight } from 'react-icons/fa';
import { MdGpsFixed } from 'react-icons/md';
import { HiLocationMarker } from 'react-icons/hi';

const DeliveryFeatures = () => {
  const navigate = useNavigate();

  const handleGPSClick = () => {
    navigate('/location'); // Open location page
  };

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* 1. Live GPS Active Card */}
          <div 
            onClick={handleGPSClick}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-5 border border-blue-200 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MdGpsFixed className="text-blue-600 text-xl sm:text-2xl" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">
                    Precision Location
                  </h3>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-600 mb-3 pr-2">
                  Automatic address detection for easy checkout.
                </p>

                {/* Live GPS Active Badge */}
                <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-green-700">
                    LIVE GPS ACTIVE
                  </span>
                </div>
              </div>

              {/* Right Arrow Icon */}
              <div className="bg-white rounded-full p-2 shadow-md group-hover:translate-x-1 transition">
                <FaChevronRight className="text-blue-600 text-sm" />
              </div>
            </div>

            {/* Location Preview (will show current location) */}
            <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
              <HiLocationMarker className="text-gray-400" />
              <span className="truncate">
                {localStorage.getItem('userAddress') || 'Tap to detect location'}
              </span>
            </div>
          </div>

          {/* 2. Express Delivery Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 sm:p-5 border border-orange-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-orange-500 rounded-full p-2 sm:p-3">
                <FaMotorcycle className="text-white text-xl sm:text-2xl" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">
                  Express Delivery
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  Average arrival time: <span className="font-bold text-orange-600">24 minutes</span> or it's on us.
                </p>

                {/* Timer Display */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg">
                    <FaClock className="text-orange-500 text-xs" />
                    <span className="text-xs font-semibold">24 min avg</span>
                  </div>
                  <span className="text-xs text-gray-500">Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryFeatures;