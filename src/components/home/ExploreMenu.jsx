import React, { useState, useEffect } from 'react'; // ✅ Added useEffect
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateCartQuantity } from '../../redux/actions/cartActions';
import { FaPlus, FaMinus, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { getProducts, getCategories } from '../../services/api'; // ✅ Import API functions

const ExploreMenu = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuItems, setMenuItems] = useState([]); // ✅ Will be filled from API
  const [categories, setCategories] = useState(['All']); // ✅ Will be filled from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // 📌 Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // 📌 Fetch products when category changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      // Add 'All' at the beginning
      setCategories(['All', ...response.data.data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if API fails
      setCategories(['All', 'Burgers', 'Sushi', 'Healthy', 'Pasta']);
    }
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      
      const response = await getProducts(params);
      setMenuItems(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load menu items. Please try again.');
      
      // Fallback to hardcoded data if API fails (optional)
      // setMenuItems(fallbackMenuItems);
    } finally {
      setLoading(false);
    }
  };

  // Get quantity of item in cart
  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Handle add to cart - ✅ Sirf ID bhejo
const handleAddToCart = (item) => {
  dispatch(addToCart(item._id, 1)); // Sirf ID
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

  // Loading State
  if (loading) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">
            Explore <span className="text-red-500">Menu</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[1,2,3,4,5,6,7,8].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Explore <span className="text-red-500">Menu</span>
          </h2>
          <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-md mx-auto">
            <p className="mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Heading - Explore Menu */}
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
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-red-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found in this category.</p>
          </div>
        ) : (
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
        )}

        {/* View All Button */}
        <div className="text-center mt-8 sm:mt-10">
          <button className="bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition inline-flex items-center gap-2 text-sm sm:text-base">
            View Full Menu
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hide Scrollbar CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ExploreMenu;