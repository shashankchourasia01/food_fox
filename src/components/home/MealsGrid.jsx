import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateCartQuantity } from '../../redux/actions/cartActions';
import { FaPlus, FaMinus } from 'react-icons/fa';

// 📸 Images dalo - public/images/simple-meals/ folder mein
const mealsData = [
  {
    id: 201,
    name: 'Special Thali',
    image: '/images/simple-meals/special-thali.jpg',
    price: 249
  },
  {
    id: 202,
    name: 'Deluxe Thali',
    image: '/images/simple-meals/deluxe-thali.jpg',
    price: 199
  },
  {
    id: 203,
    name: 'Classic Thali',
    image: '/images/simple-meals/classic-thali.jpg',
    price: 149
  },
  {
    id: 204,
    name: 'Special Thali',
    image: '/images/simple-meals/special-thali.jpg',
    price: 249
  },
  {
    id: 205,
    name: 'Deluxe Thali',
    image: '/images/simple-meals/deluxe-thali.jpg',
    price: 199
  },
  {
    id: 206,
    name: 'Classic Thali',
    image: '/images/simple-meals/classic-thali.jpg',
    price: 149
  },
  {
    id: 207,
    name: 'Special Thali',
    image: '/images/simple-meals/special-thali.jpg',
    price: 249
  },
  {
    id: 208,
    name: 'Deluxe Thali',
    image: '/images/simple-meals/deluxe-thali.jpg',
    price: 199
  },
  {
    id: 209,
    name: 'Classic Thali',
    image: '/images/simple-meals/classic-thali.jpg',
    price: 149
  }
];

const SimpleMeals = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Get quantity of item in cart
  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Handle add to cart
  const handleAddToCart = (meal) => {
    dispatch(addToCart({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      image: meal.image
    }));
  };

  // Handle increment
  const handleIncrement = (meal) => {
    const currentQty = getItemQuantity(meal.id);
    dispatch(updateCartQuantity(meal.id, currentQty + 1));
  };

  // Handle decrement
  const handleDecrement = (meal) => {
    const currentQty = getItemQuantity(meal.id);
    if (currentQty > 1) {
      dispatch(updateCartQuantity(meal.id, currentQty - 1));
    } else {
      dispatch(updateCartQuantity(meal.id, 0));
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading - Special Meals */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
          Special <span className="text-red-500">Meals</span>
        </h2>

        {/* 3 Columns on ALL screens - mobile, tablet, desktop */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
          {mealsData.map((meal) => {
            const quantity = getItemQuantity(meal.id);
            
            return (
              <div key={meal.id} className="text-center">
                {/* Circular Image - smaller on mobile */}
                <div className="relative mb-2 sm:mb-3">
                  <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-2 sm:border-4 border-red-100 shadow-lg hover:shadow-xl transition">
                    <img 
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                </div>

                {/* Meal Name - smaller text on mobile */}
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-1 sm:mb-2 line-clamp-1">
                  {meal.name}
                </h3>

                {/* Price */}
                <p className="text-red-500 font-bold text-sm sm:text-base md:text-lg mb-2 sm:mb-3">
                  ₹{meal.price}
                </p>

                {/* Add/Remove Buttons - compact on mobile */}
                {quantity === 0 ? (
                  <button
                    onClick={() => handleAddToCart(meal)}
                    className="w-16 xs:w-20 sm:w-24 md:w-32 mx-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-1 sm:py-2 rounded-full text-xs sm:text-sm transition transform hover:scale-105"
                  >
                    ADD
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
                    <button
                      onClick={() => handleDecrement(meal)}
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition"
                    >
                      <FaMinus className="text-xs sm:text-sm" />
                    </button>
                    
                    <span className="font-bold text-gray-800 text-xs sm:text-sm md:text-base w-4 sm:w-5 md:w-6 text-center">
                      {quantity}
                    </span>
                    
                    <button
                      onClick={() => handleIncrement(meal)}
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition"
                    >
                      <FaPlus className="text-xs sm:text-sm" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SimpleMeals;