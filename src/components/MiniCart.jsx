import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { updateCartQuantity, removeFromCart } from '../redux/actions/cartActions';

const MiniCart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  // Calculate total
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-6">
        <div className="text-center">
          <FaShoppingCart className="text-5xl text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
          <p className="text-sm text-gray-500 mb-4">Add items to get started</p>
          <Link 
            to="/" 
            className="inline-block bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
          >
            Browse Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-red-500 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold">Your Cart ({totalItems} items)</h3>
        <span className="text-sm opacity-90">Total: ₹{totalAmount}</span>
      </div>

      {/* Cart Items */}
      <div className="max-h-96 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex gap-3">
              {/* Item Image */}
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              
              {/* Item Details */}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-500 mb-2">{item.pieces}</p>
                
                {/* Price and Quantity Controls */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-red-500">
                    ₹{item.price * item.quantity}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button 
                        onClick={() => dispatch(updateCartQuantity(item.id, item.quantity - 1))}
                        className="p-1 hover:bg-gray-100 rounded-l-lg"
                      >
                        <FaMinus className="text-xs text-gray-600" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => dispatch(updateCartQuantity(item.id, item.quantity + 1))}
                        className="p-1 hover:bg-gray-100 rounded-r-lg"
                      >
                        <FaPlus className="text-xs text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50">
        <Link 
          to="/cart"
          className="block w-full bg-red-500 hover:bg-red-600 text-white text-center font-semibold py-2.5 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] mb-2"
        >
          View Full Cart
        </Link>
        <Link 
          to="/checkout"
          className="block w-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-center font-semibold py-2 rounded-lg transition"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default MiniCart;