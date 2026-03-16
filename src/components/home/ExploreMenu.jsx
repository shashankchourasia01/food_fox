
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../../services/api';
import { addToCart, updateCartQuantity } from '../../redux/actions/cartActions';
import { FaPlus, FaMinus, FaStar, FaStarHalfAlt, FaLock } from 'react-icons/fa';

const ExploreMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // 👈 Login prompt ke liye

  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const { user } = useSelector((state) => state.auth); // 👈 Check if user is logged in

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(['All', ...response.data.data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const response = await getProducts(params);
      setMenuItems(response.data.data);
      setError('');
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  // Get quantity of item in cart
  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // ✅ Handle add to cart with login check
  const handleAddToCart = (item) => {
    if (!user) {
      // Agar user logged in nahi hai to login prompt dikhao
      setShowLoginPrompt(true);
      return;
    }

    // User logged in hai to cart mein add karo
    dispatch(addToCart(item._id, 1));
  };

  // Handle increment
  const handleIncrement = (item) => {
    const currentQty = getItemQuantity(item._id);
    dispatch(updateCartQuantity(item._id, currentQty + 1));
  };

  // Handle decrement
  const handleDecrement = (item) => {
    const currentQty = getItemQuantity(item._id);
    if (currentQty > 1) {
      dispatch(updateCartQuantity(item._id, currentQty - 1));
    } else {
      dispatch(updateCartQuantity(item._id, 0));
    }
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 text-xs sm:text-sm" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-xs sm:text-sm" />);
    }

    return stars;
  };

  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">
          Explore <span className="text-red-500">Menu</span>
        </h2>

        {/* Category Filters */}
        <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar">
          <div className="flex space-x-2 mx-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === category
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-red-50'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>



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
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-5 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
                  Login Required
                </h3>

                {/* Description */}
                <p className="text-center text-gray-600 mb-6">
                  Please login or signup to add items to your cart and enjoy our delicious meals!
                </p>

                {/* Feature List */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">Save your favorite items</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">Track your orders in real-time</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">Get exclusive offers & discounts</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      navigate('/login');
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
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
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      navigate('/login');
                    }}
                    className="text-red-500 hover:text-red-600 font-semibold"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {menuItems.map((item) => {
            const quantity = getItemQuantity(item._id);

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />

                  {/* HOT Badge */}
                  {item.isHot && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      HOT
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-2 sm:p-3">
                  {/* Rating Stars */}
                  <div className="flex items-center mb-1">
                    <div className="flex mr-1">
                      {renderRating(item.rating)}
                    </div>
                    <span className="text-xs text-gray-500">
                      {item.rating}
                    </span>
                  </div>

                  {/* Name and Description */}
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 line-clamp-1">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price and Add/Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-red-500 font-bold text-sm sm:text-base">
                      ₹{item.price}
                    </span>

                    {quantity === 0 ? (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-8 h-8 sm:w-9 sm:h-9 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition transform hover:scale-105"
                      >
                        <FaPlus className="text-sm sm:text-base" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleDecrement(item)}
                          className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition"
                        >
                          <FaMinus className="text-xs sm:text-sm" />
                        </button>

                        <span className="font-bold text-gray-800 text-xs sm:text-sm w-5 text-center">
                          {quantity}
                        </span>

                        <button
                          onClick={() => handleIncrement(item)}
                          className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition"
                        >
                          <FaPlus className="text-xs sm:text-sm" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreMenu;