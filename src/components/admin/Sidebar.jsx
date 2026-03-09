import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // 👈 useNavigate add kiya
import { 
  FaHome, 
  FaBox, 
  FaShoppingBag, 
  FaUsers,
  FaSignOutAlt,
  FaArrowLeft // 👈 Home icon ke liye
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate(); // 👈 Navigation ke liye

  const menuItems = [
    { path: '/admin', icon: <FaHome />, label: 'Dashboard' },
    { path: '/admin/products', icon: <FaBox />, label: 'Products' },
    { path: '/admin/orders', icon: <FaShoppingBag />, label: 'Orders' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' }
  ];

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

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
        <div className="p-4 border-b flex items-center justify-between">
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

          {/* 👇 Home Button - Main Website पर जाने के लिए */}
          <button
            onClick={() => {
              setIsOpen(false);
              navigate('/'); // Home page पर redirect
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition mt-2 border-t border-gray-100 pt-4"
          >
            <FaArrowLeft className="text-lg" />
            <span>Back to Website</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-500 transition mt-2"
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




// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { 
//   FaHome, 
//   FaBox, 
//   FaShoppingBag, 
//   FaUsers,
//   FaSignOutAlt 
// } from 'react-icons/fa';

// const Sidebar = ({ isOpen, setIsOpen }) => {
//   const menuItems = [
//     { path: '/admin', icon: <FaHome />, label: 'Dashboard' },
//     { path: '/admin/products', icon: <FaBox />, label: 'Products' },
//     { path: '/admin/orders', icon: <FaShoppingBag />, label: 'Orders' },
//     { path: '/admin/users', icon: <FaUsers />, label: 'Users' }
//   ];

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-white bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div className={`
//         fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50
//         transform transition-transform duration-300 ease-in-out
//         lg:translate-x-0 lg:static lg:shadow-none
//         ${isOpen ? 'translate-x-0' : '-translate-x-full'}
//       `}>
//         {/* Logo */}
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-bold text-red-500">Admin Panel</h2>
//         </div>

//         {/* Menu Items */}
//         <nav className="p-4">
//           {menuItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               onClick={() => setIsOpen(false)}
//               className={({ isActive }) => `
//                 flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition
//                 ${isActive 
//                   ? 'bg-red-500 text-white' 
//                   : 'text-gray-700 hover:bg-red-50 hover:text-red-500'
//                 }
//               `}
//             >
//               <span className="text-lg">{item.icon}</span>
//               <span>{item.label}</span>
//             </NavLink>
//           ))}

//           {/* Logout */}
//           <button
//             onClick={() => {
//               localStorage.removeItem('token');
//               localStorage.removeItem('user');
//               window.location.href = '/login';
//             }}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-500 transition mt-4"
//           >
//             <FaSignOutAlt className="text-lg" />
//             <span>Logout</span>
//           </button>
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Sidebar;