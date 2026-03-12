import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaUserCircle, 
  FaMapMarkerAlt,
  FaHome,
  FaBars // 👈 Mobile menu icon
} from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import useGeolocation from '../hooks/useGeolocation';
import { openAccountSidebar } from '../redux/actions/uiActions';
import MiniCart from './MiniCart';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { location } = useGeolocation();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle home navigation
  const handleHomeClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className={`
      bg-white shadow-md sticky top-0 z-50 transition-all duration-300
      ${scrolled ? 'shadow-lg' : 'shadow-md'}
    `}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Left Section - Logo & Location (Flexible width) */}
          <div className="flex items-center flex-1 min-w-0">
            {/* Home Icon - Always visible */}
            <button
              onClick={handleHomeClick}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 hover:bg-gray-100 rounded-lg transition group flex-shrink-0"
              aria-label="Home"
            >
              <FaHome className="text-lg sm:text-xl text-gray-700 group-hover:text-red-500 transition" />
            </button>

            {/* Delivery Location - Truncated on mobile */}
            <div 
              className="flex items-center space-x-1 sm:space-x-2 cursor-pointer hover:bg-gray-50 p-1.5 sm:p-2 rounded-lg transition ml-1 sm:ml-2 flex-1 min-w-0"
              onClick={() => navigate('/location')}
            >
              <HiLocationMarker className="text-red-500 text-lg sm:text-xl flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-xs text-gray-500">Deliver to</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate max-w-[100px] xs:max-w-[120px] sm:max-w-[180px] md:max-w-[220px]">
                    {location.loading ? (
                      <span className="text-gray-400 animate-pulse">Detecting...</span>
                    ) : (
                      location.address || 'Select location'
                    )}
                  </span>
                  <FaMapMarkerAlt className="text-gray-400 text-[10px] sm:text-xs flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Cart & Account (Fixed width) */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Cart Icon */}
            <div className="relative">
              <button
                onClick={() => setShowMiniCart(!showMiniCart)}
                className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition group focus:outline-none"
                aria-label="Shopping cart"
              >
                <FaShoppingCart className="text-xl sm:text-2xl text-gray-700 group-hover:text-red-500 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mini Cart Dropdown */}
              {showMiniCart && (
                <div className="absolute top-10 sm:top-12 right-0 z-50 w-72 sm:w-80">
                  <MiniCart onClose={() => setShowMiniCart(false)} />
                </div>
              )}
            </div>

            {/* Account Icon */}
            <button 
              onClick={() => dispatch(openAccountSidebar())}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition group focus:outline-none"
              aria-label="Account"
            >
              <FaUserCircle className="text-xl sm:text-2xl text-gray-700 group-hover:text-red-500 transition" />
            </button>
          </div>
        </div>
      </div>

      {/* Error message toast for location */}
      {location.error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 py-1.5 px-3 sm:py-2 sm:px-4">
          <div className="container mx-auto px-3 sm:px-4">
            <p className="text-[10px] sm:text-xs text-yellow-700 flex items-center gap-1">
              <span>⚠️</span>
              <span className="truncate">{location.error}. Please select manually.</span>
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;





// navbar pele wala

// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { 
//   FaShoppingCart, 
//   FaUserCircle, 
//   FaMapMarkerAlt,
//   FaHome  // 👈 Home icon import
// } from 'react-icons/fa';
// import { HiLocationMarker } from 'react-icons/hi';
// import useGeolocation from '../hooks/useGeolocation';
// import { openAccountSidebar } from '../redux/actions/uiActions';
// import MiniCart from './MiniCart';

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { location } = useGeolocation();
//   const cartItems = useSelector((state) => state.cart?.cartItems || []);
//   const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
//   const [showMiniCart, setShowMiniCart] = useState(false);

//   // Handle home navigation
//   const handleHomeClick = () => {
//     navigate('/');
//   };

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
          
//           {/* Left Section - Logo/Brand + Home */}
//           <div className="flex items-center space-x-4">
//             {/* Home Icon */}
//             <button
//               onClick={handleHomeClick}
//               className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-lg transition group"
//               aria-label="Home"
//             >
//               <FaHome className="text-xl text-gray-700 group-hover:text-red-500 transition" />
//               <span className="hidden sm:inline text-sm font-medium text-gray-700 group-hover:text-red-500 transition">
//                 Home
//               </span>
//             </button>

//             {/* Delivery Location */}
//             <div 
//               className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
//               onClick={() => navigate('/location')}
//             >
//               <HiLocationMarker className="text-red-500 text-xl flex-shrink-0" />
//               <div className="flex flex-col">
//                 <span className="text-xs text-gray-500">Deliver to</span>
//                 <div className="flex items-center space-x-1">
//                   <span className="text-sm font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
//                     {location.loading ? (
//                       <span className="text-gray-400">Detecting...</span>
//                     ) : (
//                       location.address
//                     )}
//                   </span>
//                   <FaMapMarkerAlt className="text-gray-400 text-xs" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Cart & Account */}
//           <div className="flex items-center space-x-4">
//             {/* Cart Icon with MiniCart */}
//             <div 
//               className="relative"
//               onMouseEnter={() => setShowMiniCart(true)}
//               onMouseLeave={() => setShowMiniCart(false)}
//             >
//               <Link 
//                 to="/cart" 
//                 className="relative p-2 hover:bg-gray-100 rounded-full transition group block"
//                 onClick={() => setShowMiniCart(false)} // Close cart on navigation
//               >
//                 <FaShoppingCart className="text-2xl text-gray-700 group-hover:text-red-500 transition" />
//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
//                     {cartCount}
//                   </span>
//                 )}
//               </Link>

//               {/* Mini Cart Dropdown */}
//               {showMiniCart && (
//                 <div className="absolute top-12 right-0 z-50">
//                   <MiniCart onClose={() => setShowMiniCart(false)} />
//                 </div>
//               )}
//             </div>

//             {/* Account Icon */}
//             <button 
//               onClick={() => dispatch(openAccountSidebar())}
//               className="p-2 hover:bg-gray-100 rounded-full transition group focus:outline-none"
//             >
//               <FaUserCircle className="text-2xl text-gray-700 group-hover:text-red-500 transition" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Error message toast for location */}
//       {location.error && (
//         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2">
//           <div className="container mx-auto px-4">
//             <p className="text-xs text-yellow-700">
//               ⚠️ {location.error}. You can manually select your location.
//             </p>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;