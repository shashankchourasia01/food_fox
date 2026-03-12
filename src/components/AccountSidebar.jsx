import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { closeAccountSidebar } from '../redux/actions/uiActions';
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaWallet,
  FaShoppingBag,
  FaSignOutAlt,
  FaTimes,
  FaGift,
  FaRegCommentDots,
  FaHome,
  FaLock,
  FaTachometerAlt,  // 👈 Admin Dashboard icon
  FaCog
} from 'react-icons/fa';
import { MdDashboard, MdHelp } from 'react-icons/md';
import { logout } from '../services/api';

const AccountSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAccountSidebarOpen } = useSelector((state) => state.ui);
  // ✅ Redux से user लो (सुरक्षित तरीका)
  const { user } = useSelector((state) => state.auth);
  // ✅ Fallback के लिए localStorage से भी लो
  const localUser = JSON.parse(localStorage.getItem('user'));
  const currentUser = user || localUser;  // Redux नहीं तो localStorage

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(closeAccountSidebar());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close sidebar when pressing Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        dispatch(closeAccountSidebar());
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [dispatch]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isAccountSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAccountSidebarOpen]);

  // Custom handler for Manage Address
  const handleManageAddress = () => {
    dispatch(closeAccountSidebar());
    setTimeout(() => {
      navigate('/location');
    }, 300);
  };

  // ✅ Regular menu items
  const menuItems = [
    { icon: <FaHome />, label: 'Home', path: '/', requiresAuth: false },
    { icon: <FaShoppingBag />, label: 'My Orders', path: '/my-orders', requiresAuth: true },
    {
      icon: <MdHelp />,
      label: 'Help',
      onClick: () => {
        const message = encodeURIComponent("Hi... I need help with my order.");
        window.open(`https://wa.me/919229264244?text=${message}`, '_blank');
      },
      requiresAuth: false
    },
    { icon: <FaRegCommentDots />, label: 'Feedback', path: '/feedback', requiresAuth: false },
    { icon: <FaMapMarkerAlt />, label: 'Manage Address', onClick: handleManageAddress, requiresAuth: true },
  ];

  if (!isAccountSidebarOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-white bg-opacity-50 z-50 transition-opacity"
        onClick={() => dispatch(closeAccountSidebar())}
      />

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isAccountSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="bg-linear-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <FaUserCircle className="text-5xl" />
              <div>
                <h2 className="text-xl font-bold">Hi {currentUser?.name || 'User'}</h2>
                <p className="text-sm opacity-90">
                  {currentUser ? (
                    currentUser.role === 'admin' ? 'Admin Panel' : 'Welcome back!'
                  ) : 'Please login to continue'}
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(closeAccountSidebar())}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-4 overflow-y-auto h-[calc(100%-120px)]">
          
          {/* ✅ Admin Dashboard Option - सिर्फ admin को दिखेगा */}
          {currentUser && currentUser.role === 'admin' && (
            <div className="mb-3 border-b border-gray-100 pb-3">
              <div className="px-6 mb-2">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Admin</p>
              </div>
              <Link
                to="/admin"
                onClick={() => dispatch(closeAccountSidebar())}
                className="flex items-center space-x-4 px-6 py-3 hover:bg-red-50 transition group border-l-4 border-transparent hover:border-red-500"
              >
                <span className="text-xl text-red-500 group-hover:text-red-600 transition">
                  <FaTachometerAlt />
                </span>
                <span className="text-gray-800 font-medium group-hover:text-red-600 transition">
                  Dashboard
                </span>
              </Link>
            </div>
          )}

          {/* Regular Menu Items */}
          {menuItems.map((item, index) => {
            // Agar item requiresAuth true hai aur user logged in nahi hai, to mat dikhao
            if (item.requiresAuth && !currentUser) {
              return null;
            }

            if (item.onClick) {
              return (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    dispatch(closeAccountSidebar());
                  }}
                  className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-gray-50 transition group text-left"
                >
                  <span className="text-xl text-gray-500 group-hover:text-red-500 transition">
                    {item.icon}
                  </span>
                  <span className="text-gray-700 font-medium group-hover:text-red-500 transition">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => dispatch(closeAccountSidebar())}
                className="flex items-center space-x-4 px-6 py-4 hover:bg-gray-50 transition group"
              >
                <span className="text-xl text-gray-500 group-hover:text-red-500 transition">
                  {item.icon}
                </span>
                <span className="text-gray-700 font-medium group-hover:text-red-500 transition">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Login/Signup Button */}
          {currentUser ? (
            <div className="px-6 mt-6">
              <div className="text-center mb-3">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-800">{currentUser.name}</p>
                {currentUser.role === 'admin' && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center space-x-2"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="px-6 mt-6">
              <button
                onClick={() => {
                  dispatch(closeAccountSidebar());
                  navigate('/login');
                }}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center space-x-2"
              >
                <FaSignOutAlt className="rotate-180" />
                <span>Login / Signup</span>
              </button>
            </div>
          )}

          {/* Version Info */}
          <div className="absolute bottom-4 left-6 text-xs text-gray-400">
            Version 2.0.0
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSidebar;













// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { closeAccountSidebar } from '../redux/actions/uiActions';
// import {
//   FaUserCircle,
//   FaMapMarkerAlt,
//   FaWallet,
//   FaShoppingBag,
//   FaSignOutAlt,
//   FaTimes,
//   FaGift,
//   FaRegCommentDots,
//   FaHome,
//   FaLock
// } from 'react-icons/fa';
// import { MdDashboard, MdHelp } from 'react-icons/md';
// import { logout } from '../services/api';

// const AccountSidebar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAccountSidebarOpen } = useSelector((state) => state.ui);
//   const user = JSON.parse(localStorage.getItem('user'));

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await logout();
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       dispatch(closeAccountSidebar());
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // Close sidebar when pressing Escape key
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === 'Escape') {
//         dispatch(closeAccountSidebar());
//       }
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [dispatch]);

//   // Prevent body scroll when sidebar is open
//   useEffect(() => {
//     if (isAccountSidebarOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isAccountSidebarOpen]);

//   // Custom handler for Manage Address
//   const handleManageAddress = () => {
//     dispatch(closeAccountSidebar());
//     setTimeout(() => {
//       navigate('/location');
//     }, 300);
//   };

//   // ✅ Menu items with requiresAuth flag
//   const menuItems = [
//     { icon: <FaHome />, label: 'Home', path: '/', requiresAuth: false }, // Always show
//     { icon: <FaShoppingBag />, label: 'My Orders', path: '/my-orders', requiresAuth: true }, // Only when logged in
//     {
//       icon: <MdHelp />,
//       label: 'Help',
//       onClick: () => {
//         const message = encodeURIComponent("Hi... I need help with my order.");
//         window.open(`https://wa.me/919229264244?text=${message}`, '_blank');
//       },
//       requiresAuth: false // Always show
//     },
//     { icon: <FaRegCommentDots />, label: 'Feedback', path: '/feedback', requiresAuth: false }, // Always show
//     { icon: <FaMapMarkerAlt />, label: 'Manage Address', onClick: handleManageAddress, requiresAuth: true }, // Only when logged in
//   ];

//   if (!isAccountSidebarOpen) return null;

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
//         onClick={() => dispatch(closeAccountSidebar())}
//       />

//       {/* Sidebar */}
//       <div className={`
//         fixed top-0 left-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50
//         transform transition-transform duration-300 ease-in-out
//         ${isAccountSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//       `}>
//         {/* Header */}
//         <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
//           <div className="flex justify-between items-start">
//             <div className="flex items-center space-x-3">
//               <FaUserCircle className="text-5xl" />
//               <div>
//                 <h2 className="text-xl font-bold">Hi {user?.name || 'User'}</h2>
//                 <p className="text-sm opacity-90">
//                   {user ? 'Welcome back!' : 'Please login to continue'}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => dispatch(closeAccountSidebar())}
//               className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition"
//             >
//               <FaTimes className="text-xl" />
//             </button>
//           </div>
//         </div>

//         {/* Menu Items */}
//         <div className="py-4 overflow-y-auto h-[calc(100%-120px)]">
//           {menuItems.map((item, index) => {
//             // ✅ Agar item requiresAuth true hai aur user logged in nahi hai, to mat dikhao
//             if (item.requiresAuth && !user) {
//               return null;
//             }

//             if (item.onClick) {
//               return (
//                 <button
//                   key={index}
//                   onClick={() => {
//                     item.onClick();
//                     dispatch(closeAccountSidebar());
//                   }}
//                   className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-gray-50 transition group text-left"
//                 >
//                   <span className="text-xl text-gray-500 group-hover:text-red-500 transition">
//                     {item.icon}
//                   </span>
//                   <span className="text-gray-700 font-medium group-hover:text-red-500 transition">
//                     {item.label}
//                   </span>
//                 </button>
//               );
//             }

//             return (
//               <Link
//                 key={index}
//                 to={item.path}
//                 onClick={() => dispatch(closeAccountSidebar())}
//                 className="flex items-center space-x-4 px-6 py-4 hover:bg-gray-50 transition group"
//               >
//                 <span className="text-xl text-gray-500 group-hover:text-red-500 transition">
//                   {item.icon}
//                 </span>
//                 <span className="text-gray-700 font-medium group-hover:text-red-500 transition">
//                   {item.label}
//                 </span>
//               </Link>
//             );
//           })}

//           {/* Login/Signup Button */}
//           {user ? (
//             <div className="px-6 mt-6">
//               <div className="text-center mb-3">
//                 <p className="text-sm text-gray-600">Logged in as</p>
//                 <p className="font-semibold text-gray-800">{user.name}</p>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center space-x-2"
//               >
//                 <FaSignOutAlt />
//                 <span>Logout</span>
//               </button>
//             </div>
//           ) : (
//             <div className="px-6 mt-6">
//               <button
//                 onClick={() => {
//                   dispatch(closeAccountSidebar());
//                   navigate('/login');
//                 }}
//                 className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center space-x-2"
//               >
//                 <FaSignOutAlt className="rotate-180" />
//                 <span>Login / Signup</span>
//               </button>
//             </div>
//           )}

//           {/* Version Info */}
//           <div className="absolute bottom-4 left-6 text-xs text-gray-400">
//             Version 1.0.0
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AccountSidebar;