import React from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';

const Header = ({ setIsOpen }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
      >
        <FaBars className="text-xl text-gray-600" />
      </button>

      {/* Page Title - Will be set by child components */}
      <h1 className="text-xl font-semibold text-gray-800 lg:block hidden">
        Admin Dashboard
      </h1>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
        <FaUserCircle className="text-3xl text-gray-400" />
      </div>
    </header>
  );
};

export default Header;