import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaMapMarkerAlt, FaCrosshairs, FaPlus, FaCheck } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { MdGpsFixed, MdMyLocation, MdOutlineLocationOn } from 'react-icons/md';
import useGeolocation from '../hooks/useGeolocation';
import axios from 'axios'; // 👈 Install karna: npm install axios

const LocationPage = () => {
  const navigate = useNavigate();
  const location = useGeolocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Load saved addresses from localStorage on mount
  useEffect(() => {
    loadSavedAddresses();
  }, []);

  const loadSavedAddresses = () => {
    try {
      const addresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
      setSavedAddresses(addresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      setSavedAddresses([]);
    }
  };

  // Handle use current location
  const handleUseCurrentLocation = () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Get address from coordinates using reverse geocoding
          const { latitude, longitude } = position.coords;
          
          // Using OpenStreetMap Nominatim API (free)
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          
          const address = response.data.display_name || 
                         `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          // Save to localStorage
          localStorage.setItem('userAddress', address);
          localStorage.setItem('userCoordinates', JSON.stringify({ latitude, longitude }));
          
          // Success - go back
          navigate(-1);
        } catch (error) {
          console.error('Error getting address:', error);
          alert('Failed to get your location. Please try again or enter manually.');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert('Please allow location access to use this feature');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable');
            break;
          case error.TIMEOUT:
            alert('Location request timed out');
            break;
          default:
            alert('An unknown error occurred');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Handle manual search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    
    try {
      // Using OpenStreetMap Nominatim API for search (free)
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Bangalore`
      );
      
      const results = response.data.map(item => ({
        id: item.place_id,
        address: item.display_name,
        lat: item.lat,
        lon: item.lon,
        type: item.type
      }));
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle address selection
  const handleSelectAddress = (address, lat = null, lon = null) => {
    localStorage.setItem('userAddress', address);
    
    if (lat && lon) {
      localStorage.setItem('userCoordinates', JSON.stringify({ latitude: lat, longitude: lon }));
    }
    
    navigate(-1);
  };

  // Save new address to saved addresses
  const handleSaveAddress = (address, lat, lon) => {
    const newAddress = {
      id: Date.now(),
      type: 'Other',
      address: address,
      details: 'Saved from search',
      lat: lat,
      lon: lon,
      timestamp: new Date().toISOString()
    };
    
    const updatedAddresses = [...savedAddresses, newAddress];
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    setSavedAddresses(updatedAddresses);
    
    // Also select this address
    handleSelectAddress(address, lat, lon);
  };

  // Get icon based on address type
  const getAddressIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'home': return '🏠';
      case 'work': return '💼';
      default: return '📍';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14 sm:h-16">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition mr-2"
              aria-label="Go back"
            >
              <FaArrowLeft className="text-gray-600 text-lg" />
            </button>
            <h1 className="flex-1 text-center font-semibold text-gray-800 text-lg sm:text-xl">
              Choose Delivery Location
            </h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-2xl">
        
        {/* Current Location Card */}
        <div 
          onClick={handleUseCurrentLocation}
          className={`
            bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-5 text-white mb-6 
            cursor-pointer transition-all transform hover:scale-[1.02] hover:shadow-xl
            ${loading ? 'opacity-75 cursor-wait' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdMyLocation className="text-2xl" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">
                {loading ? 'Getting location...' : 'Use Current Location'}
              </h3>
              <p className="text-sm text-blue-100 line-clamp-1">
                {location.loading ? 'Detecting...' : location.address || 'Tap to detect your location'}
              </p>
            </div>
            {!loading && <MdGpsFixed className="text-3xl animate-pulse" />}
          </div>
        </div>

        {/* Manual Address Search Toggle */}
        <button
          onClick={() => setShowManualSearch(!showManualSearch)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition mb-4 border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 rounded-full p-2">
              <FaSearch className="text-gray-600" />
            </div>
            <span className="text-gray-700 font-medium">
              {showManualSearch ? 'Hide search' : 'Search for area, street...'}
            </span>
          </div>
          <span className="text-blue-500 text-sm bg-blue-50 px-3 py-1 rounded-full">
            {showManualSearch ? 'Close' : 'Manual'}
          </span>
        </button>

        {/* Manual Search Section */}
        {showManualSearch && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Enter your area, landmark, or address..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                <p className="text-xs text-gray-500 px-2">Search results</p>
                {searchResults.map((result) => (
                  <div 
                    key={result.id}
                    onClick={() => handleSelectAddress(result.address, result.lat, result.lon)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                  >
                    <FaMapMarkerAlt className="text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 line-clamp-2">{result.address}</p>
                      <p className="text-xs text-gray-400 mt-1 capitalize">{result.type}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveAddress(result.address, result.lat, result.lon);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition bg-blue-50 text-blue-600 p-2 rounded-full"
                      title="Save address"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length >= 3 && searchResults.length === 0 && !searchLoading && (
              <div className="text-center py-6 text-gray-500">
                <FaMapMarkerAlt className="text-4xl mx-auto mb-2 opacity-30" />
                <p className="text-sm">No results found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        )}

        {/* Saved Addresses */}
        {savedAddresses.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <HiLocationMarker className="text-blue-500" />
              Saved Addresses
            </h3>
            <div className="space-y-3">
              {savedAddresses.map((addr) => (
                <div 
                  key={addr.id}
                  onClick={() => handleSelectAddress(addr.address, addr.lat, addr.lon)}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 cursor-pointer transition group"
                >
                  <div className="bg-blue-50 rounded-full p-2 mt-1">
                    <span className="text-lg">{getAddressIcon(addr.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                      {addr.type}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        Saved
                      </span>
                    </h4>
                    <p className="text-sm text-gray-600 mb-1 line-clamp-2">{addr.address}</p>
                    <p className="text-xs text-gray-400">{addr.details}</p>
                  </div>
                  <FaCheck className="text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches (Dummy) */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Popular Areas in Bangalore</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {['Indiranagar', 'Koramangala', 'HSR Layout', 'Jayanagar', 'Whitefield', 'MG Road'].map((area) => (
              <button
                key={area}
                onClick={() => handleSelectAddress(`${area}, Bangalore`)}
                className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-600 transition text-center"
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Add New Address Button */}
        <button 
          onClick={() => setShowManualSearch(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition flex items-center justify-center gap-2"
        >
          <FaPlus />
          <span>Add New Address</span>
        </button>
      </div>
    </div>
  );
};

export default LocationPage;




// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaSearch, FaMapMarkerAlt, FaCrosshairs } from 'react-icons/fa';
// import { HiLocationMarker } from 'react-icons/hi';
// import { MdGpsFixed, MdMyLocation } from 'react-icons/md';
// import useGeolocation from '../hooks/useGeolocation';

// // Sample saved addresses
// const savedAddresses = [
//   {
//     id: 1,
//     type: 'Home',
//     address: 'XH7H+42R, Jayanagar, Kal...',
//     details: 'Near Jayanagar Metro Station'
//   },
//   {
//     id: 2,
//     type: 'Work',
//     address: 'MG Road, Brigade Tower...',
//     details: 'Floor 5, Wing B'
//   }
// ];

// const LocationPage = () => {
//   const navigate = useNavigate();
//   const location = useGeolocation(); // Reuse existing hook
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showManualSearch, setShowManualSearch] = useState(false);

//   // Handle use current location
//   const handleUseCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           // Success - location will be saved by hook automatically
//           navigate(-1); // Go back to previous page
//         },
//         (error) => {
//           alert('Please allow location access to use this feature');
//         }
//       );
//     }
//   };

//   // Handle manual address selection
//   const handleSelectAddress = (address) => {
//     localStorage.setItem('userAddress', address);
//     navigate(-1);
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center h-14 sm:h-16">
//             <button 
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-gray-100 rounded-full transition"
//             >
//               <FaArrowLeft className="text-gray-600 text-lg" />
//             </button>
//             <h1 className="flex-1 text-center font-semibold text-gray-800">
//               Choose Location
//             </h1>
//             <div className="w-10"></div> {/* Spacer */}
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-4 sm:py-6">
        
//         {/* Current Location Card */}
//         <div 
//           onClick={handleUseCurrentLocation}
//           className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-5 text-white mb-6 cursor-pointer hover:shadow-lg transition transform hover:scale-[1.02]"
//         >
//           <div className="flex items-center gap-3">
//             <div className="bg-white bg-opacity-20 rounded-full p-3">
//               <MdMyLocation className="text-2xl" />
//             </div>
//             <div className="flex-1">
//               <h3 className="font-bold text-lg mb-1">Use Current Location</h3>
//               <p className="text-sm text-blue-100">
//                 {location.loading ? 'Detecting...' : location.address}
//               </p>
//             </div>
//             <MdGpsFixed className="text-3xl animate-pulse" />
//           </div>
//         </div>

//         {/* Manual Address Search Toggle */}
//         <button
//           onClick={() => setShowManualSearch(!showManualSearch)}
//           className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4"
//         >
//           <div className="flex items-center gap-2">
//             <FaSearch className="text-gray-500" />
//             <span className="text-gray-700">Search for area, street, landmark...</span>
//           </div>
//           <span className="text-blue-500 text-sm">Manual</span>
//         </button>

//         {/* Manual Search Input (conditionally shown) */}
//         {showManualSearch && (
//           <div className="mb-6">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Enter your address"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               autoFocus
//             />
            
//             {/* Search Results (dummy) */}
//             <div className="mt-2 space-y-2">
//               {['Jayanagar, Bangalore', 'JP Nagar, Bangalore', 'Indiranagar, Bangalore'].map((place) => (
//                 <div 
//                   key={place}
//                   onClick={() => handleSelectAddress(place)}
//                   className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
//                 >
//                   <FaMapMarkerAlt className="text-gray-400" />
//                   <span className="text-gray-700">{place}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Saved Addresses */}
//         <div className="mb-6">
//           <h3 className="font-semibold text-gray-700 mb-3">Saved Addresses</h3>
//           <div className="space-y-3">
//             {savedAddresses.map((addr) => (
//               <div 
//                 key={addr.id}
//                 onClick={() => handleSelectAddress(addr.address)}
//                 className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition"
//               >
//                 <div className="bg-blue-100 rounded-full p-2 mt-1">
//                   <HiLocationMarker className="text-blue-600" />
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="font-semibold text-gray-800 mb-1">{addr.type}</h4>
//                   <p className="text-sm text-gray-600 mb-1">{addr.address}</p>
//                   <p className="text-xs text-gray-500">{addr.details}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* New Address Button */}
//         <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition">
//           + Add New Address
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LocationPage;