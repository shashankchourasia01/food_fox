import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateCartQuantity } from '../../redux/actions/cartActions';
import { FaPlus, FaMinus, FaStar, FaStarHalfAlt } from 'react-icons/fa';

// 📸 Images public/images/explore-menu/ folder mein dalo
const menuItems = [
  // HOT Items
  {
    id: 301,
    name: 'Wagyu Burger',
    category: 'Burgers',
    image: '/images/explore-menu/burger.jpg',
    price: 18.50,
    description: 'Aged cheddar & truffle aioli.',
    rating: 4.5,
    isHot: true,
    tags: ['HOT']
  },
  {
    id: 302,
    name: 'Truffle Pasta',
    category: 'Pasta',
    image: '/images/explore-menu/white sause.avif',
    price: 24.00,
    description: 'Black truffle cream sauce.',
    rating: 4.8,
    isHot: false,
    tags: []
  },
  {
    id: 303,
    name: 'Seared Salmon',
    category: 'Healthy',
    image: '/images/explore-menu/mix.avif',
    price: 22.00,
    description: 'Lemon butter & asparagus.',
    rating: 4.3,
    isHot: true,
    tags: ['HOT']
  },
  {
    id: 304,
    name: 'Sushi Crunch',
    category: 'Sushi',
    image: '/images/explore-menu/delisious.avif',
    price: 16.50,
    description: 'Tuna, mayo & tempura.',
    rating: 4.6,
    isHot: false,
    tags: []
  },
  {
    id: 305,
    name: 'Classic Cheeseburger',
    category: 'Burgers',
    image: '/images/explore-menu/burger.jpg',
    price: 14.50,
    description: ' patty, cheddar, lettuce, tomato.',
    rating: 4.2,
    isHot: false,
    tags: []
  },
  {
    id: 306,
    name: 'Spicy Tuna Roll',
    category: 'Sushi',
    image: '/images/explore-menu/omelet.avif',
    price: 19.00,
    description: 'Spicy tuna, cucumber, avocado.',
    rating: 4.7,
    isHot: true,
    tags: ['HOT']
  },
  {
    id: 307,
    name: 'Quinoa Bowl',
    category: 'Healthy',
    image: '/images/explore-menu/mix.avif',
    price: 15.00,
    description: 'Quinoa, avocado, mixed greens.',
    rating: 4.4,
    isHot: false,
    tags: []
  },
  {
    id: 308,
    name: 'Mushroom Pasta',
    category: 'Pasta',
    image: '/images/explore-menu/white sause.avif',
    price: 20.00,
    description: 'Creamy mushroom sauce.',
    rating: 4.5,
    isHot: false,
    tags: []
  }
];

// Category filters
const categories = ['All', 'Burgers', 'Sushi', 'Healthy', 'Pasta'];

const ExploreMenu = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Filter items based on category
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Get quantity of item in cart
  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Handle add to cart
  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description
    }));
  };

  // Handle increment
  const handleIncrement = (item) => {
    const currentQty = getItemQuantity(item.id);
    dispatch(updateCartQuantity(item.id, currentQty + 1));
  };

  // Handle decrement
  const handleDecrement = (item) => {
    const currentQty = getItemQuantity(item.id);
    if (currentQty > 1) {
      dispatch(updateCartQuantity(item.id, currentQty - 1));
    } else {
      dispatch(updateCartQuantity(item.id, 0));
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
        
        {/* Heading - Explore Menu */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">
          Explore <span className="text-red-500">Menu</span>
        </h2>

        {/* Category Filters - Horizontal Scroll on Mobile */}
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

        {/* Menu Grid - Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredItems.map((item) => {
            const quantity = getItemQuantity(item.id);
            
            return (
              <div 
                key={item.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {/* Image Container - Square aspect ratio */}
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
                      ${item.price.toFixed(2)}
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