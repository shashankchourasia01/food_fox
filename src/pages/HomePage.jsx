import React from 'react'; 
import HeroBanner from '../components/home/HeroBanner';
import SpecialOffers from '../components/home/SpecialOffers';
import ExploreMenu from '../components/home/ExploreMenu';
import DeliveryFeatures from '../components/home/DeliveryFeatures';
import Reviews from '../components/home/Reviews';


const HomePage = () => {
  



  return (
    <div className="min-h-screen bg-white">
      
      
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Delivery Features - Live GPS + Express Delivery */}
      <DeliveryFeatures />

      {/* Special Offers Section - Dish of the Day */}
      <SpecialOffers />
      
      {/* Meals Grid Section */}
      <ExploreMenu />
      
      {/* Reviews Section */}
      <Reviews />
    </div>
  );
};

export default HomePage;