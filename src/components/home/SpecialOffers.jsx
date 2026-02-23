import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronLeft, FaChevronRight, FaClock, FaFire, FaPlus, FaMinus } from 'react-icons/fa';
import { addToCart, updateCartQuantity } from '../../redux/actions/cartActions';

const offersData = [
  {
    id: 1,
    image: '/images/offers/banner1.webp',
    title: 'Hot & Spicy Chicken Seekh Kebab',
    originalPrice: 299,
    discountedPrice: 229,
    discount: '23% OFF',
    pieces: '6 Pieces',
    time: '18 mins',
    left: 18,
    isSpicy: true,
    isBestseller: true
  },
  {
    id: 2,
    image: '/images/offers/banner2.webp',
    title: 'Butter Chicken with Naan',
    originalPrice: 349,
    discountedPrice: 279,
    discount: '20% OFF',
    pieces: 'Full',
    time: '25 mins',
    left: 12,
    isSpicy: false,
    isBestseller: true
  },
  {
    id: 3,
    image: '/images/offers/banner3.webp',
    title: 'Paneer Tikka (6 pcs)',
    originalPrice: 249,
    discountedPrice: 199,
    discount: '20% OFF',
    pieces: '6 Pieces',
    time: '20 mins',
    left: 8,
    isSpicy: true,
    isBestseller: false
  },
  {
    id: 4,
    image: '/images/offers/banner4.webp',
    title: 'Hyderabadi Chicken Biryani',
    originalPrice: 279,
    discountedPrice: 219,
    discount: '21% OFF',
    pieces: 'Full',
    time: '30 mins',
    left: 15,
    isSpicy: true,
    isBestseller: true
  },
  {
    id: 5,
    image: '/images/offers/banner5.webp',
    title: 'Dal Makhani + 2 Tandoori Roti',
    originalPrice: 199,
    discountedPrice: 149,
    discount: '25% OFF',
    pieces: 'Combo',
    time: '15 mins',
    left: 10,
    isSpicy: false,
    isBestseller: false
  }
];

const SpecialOffers = () => {
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);

  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  // Check if item is in cart
  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Handle increment
  const handleIncrement = (offer) => {
    const currentQty = getItemQuantity(offer.id);
    if (currentQty < offer.left) {
      dispatch(updateCartQuantity(offer.id, currentQty + 1));
    }
  };

  // Handle decrement
  const handleDecrement = (offer) => {
    const currentQty = getItemQuantity(offer.id);
    if (currentQty > 1) {
      dispatch(updateCartQuantity(offer.id, currentQty - 1));
    } else {
      dispatch(updateCartQuantity(offer.id, 0));
    }
  };

  // Add to cart handler
  const handleAddToCart = (offer) => {
    dispatch(addToCart({
      id: offer.id,
      name: offer.title,
      price: offer.discountedPrice,
      originalPrice: offer.originalPrice,
      image: offer.image,
      pieces: offer.pieces,
      time: offer.time
    }));
  };

  return (
    <section className="py-6 sm:py-8 md:py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            <button 
              onClick={scrollLeft}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            <button 
              onClick={scrollRight}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              aria-label="Scroll right"
            >
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
          {offersData.map((offer) => {
            const quantity = getItemQuantity(offer.id);
            
            return (
              <div 
                key={offer.id}
                className="flex-none w-[280px] sm:w-[300px] md:w-[320px] bg-white rounded-xl shadow-lg hover:shadow-xl transition border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative h-40 sm:h-44 md:h-48 rounded-t-xl overflow-hidden">
                  <img 
                    src={offer.image} 
                    alt={offer.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                  
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-lg">
                    {offer.discount}
                  </div>
                  
                  {/* Bestseller Badge */}
                  {offer.isBestseller && (
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
                      ₹{offer.discountedPrice}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{offer.originalPrice}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                    {offer.title}
                  </h3>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 mb-3 text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaClock className="text-red-400" />
                      {offer.time}
                    </span>
                    <span className="bg-gray-200 px-2 py-0.5 rounded-full">
                      {offer.pieces}
                    </span>
                  </div>

                  {/* Stock Left */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Only {offer.left} left!</span>
                      <span className="text-red-500 font-medium">🔥 {offer.left} left</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full" 
                        style={{ width: `${(offer.left / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Add to Cart / Quantity Controls */}
                  {quantity === 0 ? (
                    <button 
                      onClick={() => handleAddToCart(offer)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <span>ADD</span>
                      <span className="text-sm opacity-90">•</span>
                      <span className="text-sm">₹{offer.discountedPrice}</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => handleDecrement(offer)}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg shadow flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition group"
                      >
                        <FaMinus className="text-sm sm:text-base text-gray-600 group-hover:text-red-500" />
                      </button>
                      
                      <span className="font-bold text-sm sm:text-base text-gray-800">
                        {quantity}
                      </span>
                      
                      <button 
                        onClick={() => handleIncrement(offer)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg shadow flex items-center justify-center transition group
                          ${quantity >= offer.left ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:text-red-500'}`}
                        disabled={quantity >= offer.left}
                      >
                        <FaPlus className={`text-sm sm:text-base ${quantity >= offer.left ? 'text-gray-300' : 'text-gray-600 group-hover:text-red-500'}`} />
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

      {/* Hide Scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default SpecialOffers;