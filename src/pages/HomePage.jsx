import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import SpecialOffers from '../components/home/SpecialOffers';
import ExploreMenu from '../components/home/ExploreMenu';
// We'll create these components next

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <HeroBanner />
      {/* Special Offers Section - Dish of the Day */}
      <SpecialOffers />
      {/* Meals Grid Section - NEW */}
      <ExploreMenu />
    </div>
  );
};

export default HomePage;