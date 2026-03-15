import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaMapMarkerAlt, FaCrosshairs } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { MdGpsFixed, MdMyLocation } from 'react-icons/md';
import useLocationWithAddress from '../hooks/useLocationWithAddress';

const LocationPage = () => {
  const navigate = useNavigate();
  const { location, getCurrentLocation, selectPlace } = useLocationWithAddress();
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  useEffect(() => {
    // Load Google Maps services
    if (window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: searchQuery,
          componentRestrictions: { country: 'in' },
          types: ['address']
        },
        (results, status) => {
          if (status === 'OK' && results) {
            setPredictions(results);
          } else {
            setPredictions([]);
          }
        }
      );
    } else {
      setPredictions([]);
    }
  }, [searchQuery]);

  const handlePredictionClick = (prediction) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      { placeId: prediction.place_id, fields: ['geometry', 'formatted_address'] },
      (place, status) => {
        if (status === 'OK' && place) {
          selectPlace(place);
          
          // Save to localStorage
          localStorage.setItem('userAddress', place.formatted_address);
          localStorage.setItem('userCoordinates', JSON.stringify({
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
          }));
          
          navigate(-1);
        }
      }
    );
  };

  const handleUseCurrentLocation = () => {
    getCurrentLocation();
    // Location update handle karne ke liye useEffect use kar sakte ho
  };

  useEffect(() => {
    if (location.lat && location.lng && !location.address) {
      // Reverse geocode using Google
      if (window.google) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: location.lat, lng: location.lng } },
          (results, status) => {
            if (status === 'OK' && results[0]) {
              const addr = results[0].formatted_address;
              localStorage.setItem('userAddress', addr);
              localStorage.setItem('userCoordinates', JSON.stringify({
                latitude: location.lat,
                longitude: location.lng
              }));
              navigate(-1);
            }
          }
        );
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14 sm:h-16">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition mr-2"
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
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-5 text-white mb-6 cursor-pointer transition-all transform hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              {location.loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdMyLocation className="text-2xl" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">
                {location.loading ? 'Getting location...' : 'Use Current Location'}
              </h3>
            </div>
            {!location.loading && <MdGpsFixed className="text-3xl animate-pulse" />}
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for area, street, landmark..."
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>
        </div>

        {/* Predictions List */}
        {predictions.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                onClick={() => handlePredictionClick(prediction)}
                className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{prediction.structured_formatting.main_text}</p>
                  <p className="text-xs text-gray-500">{prediction.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPage;




// LocationPage.jsx - complete file with update function
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaSearch, FaMapMarkerAlt, FaPlus, FaCheck } from 'react-icons/fa';
// import { HiLocationMarker } from 'react-icons/hi';
// import { MdGpsFixed, MdMyLocation } from 'react-icons/md';
// import useGeolocation from '../hooks/useGeolocation';
// import axios from 'axios';

// const LocationPage = () => {
//   const navigate = useNavigate();
//   const { location, updateLocation } = useGeolocation();  // ✅ updateLocation function le liya
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showManualSearch, setShowManualSearch] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const [savedAddresses, setSavedAddresses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false);

//   useEffect(() => {
//     loadSavedAddresses();
//   }, []);

//   const loadSavedAddresses = () => {
//     try {
//       const addresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
//       setSavedAddresses(addresses);
//     } catch (error) {
//       console.error('Error loading addresses:', error);
//       setSavedAddresses([]);
//     }
//   };

//   const handleUseCurrentLocation = () => {
//     setLoading(true);
    
//     if (!navigator.geolocation) {
//       alert('Geolocation is not supported by your browser');
//       setLoading(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const { latitude, longitude } = position.coords;
          
//           const response = await axios.get(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//           );
          
//           const address = response.data.display_name;
          
//           // ✅ Update localStorage
//           localStorage.setItem('userAddress', address);
//           localStorage.setItem('userCoordinates', JSON.stringify({ latitude, longitude }));
          
//           // ✅ Update the hook state
//           updateLocation(address, { latitude, longitude });
          
//           navigate(-1);
//         } catch (error) {
//           console.error('Error getting address:', error);
//           alert('Failed to get your location. Please try again.');
//         } finally {
//           setLoading(false);
//         }
//       },
//       (error) => {
//         setLoading(false);
//         alert('Location access denied. Please allow location access.');
//       }
//     );
//   };

//   const handleSearch = async (query) => {
//     setSearchQuery(query);
    
//     if (query.length < 3) {
//       setSearchResults([]);
//       return;
//     }

//     setSearchLoading(true);
    
//     try {
//       const response = await axios.get(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Bangalore`
//       );
      
//       const results = response.data.map(item => ({
//         id: item.place_id,
//         address: item.display_name,
//         lat: item.lat,
//         lon: item.lon,
//         type: item.type
//       }));
      
//       setSearchResults(results);
//     } catch (error) {
//       console.error('Search error:', error);
//       setSearchResults([]);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const handleSelectAddress = (address, lat = null, lon = null) => {
//     // ✅ Save to localStorage
//     localStorage.setItem('userAddress', address);
    
//     if (lat && lon) {
//       localStorage.setItem('userCoordinates', JSON.stringify({ latitude: parseFloat(lat), longitude: parseFloat(lon) }));
//     }
    
//     // ✅ Update the hook state
//     updateLocation(address, lat && lon ? { latitude: parseFloat(lat), longitude: parseFloat(lon) } : null);
    
//     navigate(-1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center h-14 sm:h-16">
//             <button 
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-gray-100 rounded-full transition mr-2"
//             >
//               <FaArrowLeft className="text-gray-600 text-lg" />
//             </button>
//             <h1 className="flex-1 text-center font-semibold text-gray-800 text-lg sm:text-xl">
//               Choose Delivery Location
//             </h1>
//             <div className="w-10"></div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-4 sm:py-6 max-w-2xl">
        
//         {/* Current Location Card */}
//         <div 
//           onClick={handleUseCurrentLocation}
//           className={`
//             bg-linear-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-5 text-white mb-6 
//             cursor-pointer transition-all transform hover:scale-[1.02] hover:shadow-xl
//             ${loading ? 'opacity-75 cursor-wait' : ''}
//           `}
//         >
//           <div className="flex items-center gap-3">
//             <div className="bg-white bg-opacity-20 rounded-full p-3">
//               {loading ? (
//                 <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <MdMyLocation className="text-2xl" />
//               )}
//             </div>
//             <div className="flex-1">
//               <h3 className="font-bold text-lg mb-1">
//                 {loading ? 'Getting location...' : 'Use Current Location'}
//               </h3>
//               <p className="text-sm text-blue-100 line-clamp-1">
//                 {location.address || 'Tap to detect your location'}
//               </p>
//             </div>
//             {!loading && <MdGpsFixed className="text-3xl animate-pulse" />}
//           </div>
//         </div>

//         {/* Manual Search Toggle */}
//         <button
//           onClick={() => setShowManualSearch(!showManualSearch)}
//           className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition mb-4 border border-gray-100"
//         >
//           <div className="flex items-center gap-3">
//             <div className="bg-gray-100 rounded-full p-2">
//               <FaSearch className="text-gray-600" />
//             </div>
//             <span className="text-gray-700 font-medium">
//               {showManualSearch ? 'Hide search' : 'Search for area, street...'}
//             </span>
//           </div>
//           <span className="text-blue-500 text-sm bg-blue-50 px-3 py-1 rounded-full">
//             {showManualSearch ? 'Close' : 'Manual'}
//           </span>
//         </button>

//         {/* Manual Search Section */}
//         {showManualSearch && (
//           <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 placeholder="Enter your area, landmark, or address..."
//                 className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 autoFocus
//               />
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               {searchLoading && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//                 </div>
//               )}
//             </div>
            
//             {/* Search Results */}
//             {searchResults.length > 0 && (
//               <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
//                 {searchResults.map((result) => (
//                   <div 
//                     key={result.id}
//                     onClick={() => handleSelectAddress(result.address, result.lat, result.lon)}
//                     className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
//                   >
//                     <FaMapMarkerAlt className="text-gray-400 group-hover:text-blue-500 shrink-0" />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm text-gray-700 line-clamp-2">{result.address}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LocationPage;
