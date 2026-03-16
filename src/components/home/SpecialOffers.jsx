
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 👈 Add this
import { FaChevronLeft, FaChevronRight, FaClock, FaFire, FaPlus, FaMinus, FaLock } from 'react-icons/fa'; // 👈 Add FaLock
import { addToCart, updateCartQuantity } from '../../redux/actions/cartActions';
import { getProducts } from '../../services/api';

const SpecialOffers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 👈 Add this
  const scrollContainerRef = useRef(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // 👈 Login prompt state

  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const { user } = useSelector((state) => state.auth); // 👈 Get user from Redux

  // Fetch offers from backend
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await getProducts({ limit: 5 });
      setOffers(response.data.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Check if item is in cart
  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.product === itemId || item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // ✅ Handle add to cart with login check
  const handleAddToCart = (product) => {
    if (!user) {
      setShowLoginPrompt(true); // Show login popup
      return;
    }

    console.log('Adding to cart with ID:', product._id);
    dispatch(addToCart(product._id, 1));
  };

  // Handle increment
  const handleIncrement = (product) => {
    const currentQty = getItemQuantity(product._id);
    dispatch(updateCartQuantity(product._id, currentQty + 1));
  };

  // Handle decrement
  const handleDecrement = (product) => {
    const currentQty = getItemQuantity(product._id);
    if (currentQty > 1) {
      dispatch(updateCartQuantity(product._id, currentQty - 1));
    } else {
      dispatch(updateCartQuantity(product._id, 0));
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <section className="py-6 sm:py-8 md:py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">



        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop with blur effect */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setShowLoginPrompt(false)}
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Modal Content */}
              <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fadeIn">

                {/* Close Button */}
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Icon with gradient background */}
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center mb-5 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
                  Login Required
                </h3>

                {/* Description */}
                <p className="text-center text-gray-600 mb-6">
                  Please login or signup to add items to your cart and grab these amazing offers!
                </p>

                {/* Offer Highlights */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-6 border border-orange-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🔥</span>
                    <span className="text-sm text-gray-700">Get exclusive discounts on special offers</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">⚡</span>
                    <span className="text-sm text-gray-700">Limited time deals just for members</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎁</span>
                    <span className="text-sm text-gray-700">Early access to new dishes</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      navigate('/login');
                    }}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
                  >
                    Login Now
                  </button>
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Maybe Later
                  </button>
                </div>

                {/* Signup Link */}
                <p className="text-center text-sm text-gray-500 mt-4">
                  New here?{' '}
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      navigate('/login');
                    }}
                    className="text-red-500 hover:text-red-600 font-semibold"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              <span className="text-red-500">DISH OF THE DAY</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Special offers just for you
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex space-x-2">
            <button onClick={scrollLeft} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
              <FaChevronLeft className="text-gray-600" />
            </button>
            <button onClick={scrollRight} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {offers.map((product) => {
            const quantity = getItemQuantity(product._id);

            return (
              <div
                key={product._id}
                className="flex-none w-70 sm:w-75 md:w-[320px] bg-white rounded-xl shadow-lg hover:shadow-xl transition border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative h-40 sm:h-44 md:h-48 rounded-t-xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />

                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-lg">
                      {product.discount}% OFF
                    </div>
                  )}

                  {/* Bestseller Badge */}
                  {product.isBestseller && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <FaFire className="text-red-500" /> BESTSELLER
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                  {/* Price Section */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl sm:text-2xl font-bold text-red-500">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 mb-3 text-xs sm:text-sm text-gray-600">
                    {product.time && (
                      <span className="flex items-center gap-1">
                        <FaClock className="text-red-400" />
                        {product.time}
                      </span>
                    )}
                    {product.pieces && (
                      <span className="bg-gray-200 px-2 py-0.5 rounded-full">
                        {product.pieces}
                      </span>
                    )}
                  </div>

                  {/* Stock Left */}
                  {product.stock > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Only {product.stock} left!</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-red-500 h-1.5 rounded-full"
                          style={{ width: `${(product.stock / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Add to Cart / Quantity Controls */}
                  {quantity === 0 ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <span>ADD</span>
                      <span className="text-sm opacity-90">•</span>
                      <span className="text-sm">₹{product.price}</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => handleDecrement(product)}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg shadow flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition group"
                      >
                        <FaMinus className="text-sm sm:text-base text-gray-600 group-hover:text-red-500" />
                      </button>

                      <span className="font-bold text-sm sm:text-base text-gray-800">
                        {quantity}
                      </span>

                      <button
                        onClick={() => handleIncrement(product)}
                        disabled={quantity >= product.stock}
                        className={`w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg shadow flex items-center justify-center transition group
                          ${quantity >= product.stock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:text-red-500'}`}
                      >
                        <FaPlus className={`text-sm sm:text-base ${quantity >= product.stock ? 'text-gray-300' : 'text-gray-600 group-hover:text-red-500'}`} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Scroll Hint */}
        <div className="sm:hidden flex justify-center mt-2">
          <div className="bg-gray-200 rounded-full h-1 w-16"></div>
          <p className="text-xs text-gray-400 ml-2">Swipe to see more</p>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;