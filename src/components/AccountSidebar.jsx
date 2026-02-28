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
  FaRegCommentDots
} from 'react-icons/fa';
import { MdDashboard, MdHelp } from 'react-icons/md';
import { logout } from '../services/api';



const AccountSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAccountSidebarOpen } = useSelector((state) => state.ui);
  const user = JSON.parse(localStorage.getItem('user'));

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

  const menuItems = [
    // { icon: <MdDashboard />, label: 'My Account', path: '/account/dashboard' },
    { icon: <FaMapMarkerAlt />, label: 'Manage Address', onClick: handleManageAddress },
    // { icon: <FaGift />, label: 'Cashback', path: '/account/cashback' },
    // { icon: <FaWallet />, label: 'Wallet', path: '/account/wallet' },
    {
      icon: <MdHelp />,
      label: 'Help',
      onClick: () => {
        const message = encodeURIComponent("Hi! I need help with my order.");
        window.open(`https://wa.me/919229264244?text=${message}`, '_blank');
      }
    },
    { icon: <FaShoppingBag />, label: 'My Orders', path: '/my-orders' },
    { icon: <FaRegCommentDots />, label: 'Feedback', path: '/feedback' },
  ];

  if (!isAccountSidebarOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={() => dispatch(closeAccountSidebar())}
      />

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isAccountSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <FaUserCircle className="text-5xl" />
              <div>
                <h2 className="text-xl font-bold">Hi User</h2>
                <p className="text-sm opacity-90">Welcome back!</p>
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
          {menuItems.map((item, index) => {
            if (item.onClick) {
              return (
                <button
                  key={index}
                  onClick={item.onClick}
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

          {user ? (
            <div className="px-6 mt-6">
              <div className="text-center mb-3">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
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
            Version 1.0.0
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSidebar;