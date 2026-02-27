import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaShoppingBag, 
  FaUsers,
  FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { path: '/admin', icon: <FaHome />, label: 'Dashboard' },
    { path: '/admin/products', icon: <FaBox />, label: 'Products' },
    { path: '/admin/orders', icon: <FaShoppingBag />, label: 'Orders' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-red-500">Admin Panel</h2>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition
                ${isActive 
                  ? 'bg-red-500 text-white' 
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-500'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-500 transition mt-4"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;