import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import useGeolocation from '../hooks/useGeolocation';
import { useDispatch } from 'react-redux';
import { openAccountSidebar } from '../redux/actions/uiActions';

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useGeolocation();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left Side - Delivery Location */}
          <div className="flex items-center space-x-2 flex-1">
            <HiLocationMarker className="text-red-500 text-xl flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Deliver to</span>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
                  {location.loading ? (
                    <span className="text-gray-400">Detecting...</span>
                  ) : (
                    location.address
                  )}
                </span>
                <FaMapMarkerAlt className="text-gray-400 text-xs cursor-pointer hover:text-red-500 transition" />
              </div>
            </div>
          </div>

          {/* Right Side - Cart & Account */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition group"
            >
              <FaShoppingCart className="text-2xl text-gray-700 group-hover:text-red-500 transition" />
              {/* Cart Badge - Will update later with Redux */}
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span> */}
            </Link>

            {/* Account Icon */}
            <button
              onClick={() => dispatch(openAccountSidebar())}
              className="p-2 hover:bg-gray-100 rounded-full transition group focus:outline-none"
            >
              <FaUserCircle className="text-2xl text-gray-700 group-hover:text-red-500 transition" />
            </button>
          </div>
        </div>
      </div>

      {/* Optional: Error Message Toast if location denied */}
      {location.error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2">
          <div className="container mx-auto px-4">
            <p className="text-xs text-yellow-700">
              ⚠️ {location.error}. You can manually select your location.
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;