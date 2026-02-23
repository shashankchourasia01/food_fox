import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import SpecialOffers from '../components/home/SpecialOffers';
// We'll create these components next
// import Categories from '../components/home/Categories';
// import FeaturedItems from '../components/home/FeaturedItems';
// import HowItWorks from '../components/home/HowItWorks';
// import TodaysSpecial from '../components/home/TodaysSpecial';
// import Testimonials from '../components/home/Testimonials';
// import AppBanner from '../components/home/AppBanner';
// import HomeFooter from '../components/home/HomeFooter';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <HeroBanner />
      {/* Special Offers Section - Dish of the Day */}
      <SpecialOffers />
    </div>
  );
};

export default HomePage;