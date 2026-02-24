import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaMapMarkerAlt, FaCrosshairs } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { MdGpsFixed, MdMyLocation } from 'react-icons/md';
import useGeolocation from '../hooks/useGeolocation';

// Sample saved addresses
const savedAddresses = [
  {
    id: 1,
    type: 'Home',
    address: 'XH7H+42R, Jayanagar, Kal...',
    details: 'Near Jayanagar Metro Station'
  },
  {
    id: 2,
    type: 'Work',
    address: 'MG Road, Brigade Tower...',
    details: 'Floor 5, Wing B'
  }
];

const LocationPage = () => {
  const navigate = useNavigate();
  const location = useGeolocation(); // Reuse existing hook
  const [searchQuery, setSearchQuery] = useState('');
  const [showManualSearch, setShowManualSearch] = useState(false);

  // Handle use current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success - location will be saved by hook automatically
          navigate(-1); // Go back to previous page
        },
        (error) => {
          alert('Please allow location access to use this feature');
        }
      );
    }
  };

  // Handle manual address selection
  const handleSelectAddress = (address) => {
    localStorage.setItem('userAddress', address);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14 sm:h-16">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <FaArrowLeft className="text-gray-600 text-lg" />
            </button>
            <h1 className="flex-1 text-center font-semibold text-gray-800">
              Choose Location
            </h1>
            <div className="w-10"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        
        {/* Current Location Card */}
        <div 
          onClick={handleUseCurrentLocation}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-5 text-white mb-6 cursor-pointer hover:shadow-lg transition transform hover:scale-[1.02]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <MdMyLocation className="text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Use Current Location</h3>
              <p className="text-sm text-blue-100">
                {location.loading ? 'Detecting...' : location.address}
              </p>
            </div>
            <MdGpsFixed className="text-3xl animate-pulse" />
          </div>
        </div>

        {/* Manual Address Search Toggle */}
        <button
          onClick={() => setShowManualSearch(!showManualSearch)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4"
        >
          <div className="flex items-center gap-2">
            <FaSearch className="text-gray-500" />
            <span className="text-gray-700">Search for area, street, landmark...</span>
          </div>
          <span className="text-blue-500 text-sm">Manual</span>
        </button>

        {/* Manual Search Input (conditionally shown) */}
        {showManualSearch && (
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            
            {/* Search Results (dummy) */}
            <div className="mt-2 space-y-2">
              {['Jayanagar, Bangalore', 'JP Nagar, Bangalore', 'Indiranagar, Bangalore'].map((place) => (
                <div 
                  key={place}
                  onClick={() => handleSelectAddress(place)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span className="text-gray-700">{place}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Addresses */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Saved Addresses</h3>
          <div className="space-y-3">
            {savedAddresses.map((addr) => (
              <div 
                key={addr.id}
                onClick={() => handleSelectAddress(addr.address)}
                className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition"
              >
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <HiLocationMarker className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{addr.type}</h4>
                  <p className="text-sm text-gray-600 mb-1">{addr.address}</p>
                  <p className="text-xs text-gray-500">{addr.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Address Button */}
        <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition">
          + Add New Address
        </button>
      </div>
    </div>
  );
};

export default LocationPage;