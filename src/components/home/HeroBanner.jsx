import React, { useState, useEffect } from 'react';

// 📸 YAHAN PE APNI IMAGES DALO - public/images/banners/ FOLDER MEIN
const bannerImages = [
  {
    id: 1,
    image: '/images/banners/banner1.webp'  // Pehli banner image yahan dalo
    // title: 'DOORSTEP DELIVERY. HOMELY DELIGHT.',
    // subtitle: 'Fresh homemade food delivered to your doorstep'
  },
  {
    id: 2,
    image: '/images/banners/banner2.webp'  // Dusri banner image yahan dalo
    // title: 'SPECIAL OFFER',
    // subtitle: 'Get 20% off on first order'
  },
  {
    id: 3,
    image: '/images/banners/banner3.webp',  // Teesri banner image yahan dalo
    // title: 'TASTY & HEALTHY',
    // subtitle: '100% hygienic home-cooked meals'
  },
  {
    id: 4,
    image: '/images/banners/banner4.webp',  // Teesri banner image yahan dalo
    // title: 'TASTY & HEALTHY',
    // subtitle: '100% hygienic home-cooked meals'
  },
  {
    id: 5,
    image: '/images/banners/banner5.webp',  // Teesri banner image yahan dalo
    // title: 'TASTY & HEALTHY',
    // subtitle: '100% hygienic home-cooked meals'
  },
  {
    id: 6,
    image: '/images/banners/banner6.webp',  // Teesri banner image yahan dalo
    // title: 'TASTY & HEALTHY',
    // subtitle: '100% hygienic home-cooked meals'
  }
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 3000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Banner Images */}
      {bannerImages.map((banner, index) => (
        <div
          key={banner.id}
          className={`
            absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out
            ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}
          `}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${banner.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Banner Text - Responsive */}
          <div className="container mx-auto h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4">
                {banner.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">
                {banner.subtitle}
              </p>
              {/* CTA Button */}
              {/* <button className="mt-4 sm:mt-6 md:mt-8 bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition transform hover:scale-105">
                Order Now
              </button> */}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Hidden on mobile, visible on larger screens */}
      <button
        onClick={prevSlide}
        className="hidden sm:block absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition"
      >
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:block absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition"
      >
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all
              ${index === currentSlide 
                ? 'bg-white w-4 sm:w-6' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;