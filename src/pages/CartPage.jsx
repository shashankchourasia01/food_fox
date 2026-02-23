import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { updateCartQuantity, removeFromCart, clearCart } from '../redux/actions/cartActions';

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  // Calculate totals
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
            >
              <FaArrowLeft /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Cart ({totalItems} items)</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 border-b last:border-b-0">
                  {/* Item Image */}
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  
                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.pieces}</p>
                    <p className="text-sm text-gray-500 mb-2">{item.time}</p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {/* Price */}
                      <div>
                        <span className="text-lg font-bold text-red-500">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">₹{item.originalPrice}</span>
                        )}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button 
                            onClick={() => dispatch(updateCartQuantity(item.id, item.quantity - 1))}
                            className="p-2 hover:bg-gray-100 rounded-l-lg"
                          >
                            <FaMinus className="text-xs text-gray-600" />
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => dispatch(updateCartQuantity(item.id, item.quantity + 1))}
                            className="p-2 hover:bg-gray-100 rounded-r-lg"
                          >
                            <FaPlus className="text-xs text-gray-600" />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button 
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Clear Cart Button */}
              <div className="p-4 bg-gray-50">
                <button 
                  onClick={() => dispatch(clearCart())}
                  className="text-red-500 hover:text-red-600 font-semibold text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="font-semibold">
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-xs text-green-600">
                    Add ₹{500 - subtotal} more for FREE delivery
                  </p>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-red-500">₹{total}</span>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/checkout"
                className="block w-full bg-red-500 hover:bg-red-600 text-white text-center font-semibold py-3 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Proceed to Checkout
              </Link>
              
              <Link 
                to="/"
                className="block text-center text-gray-500 hover:text-gray-700 text-sm mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;