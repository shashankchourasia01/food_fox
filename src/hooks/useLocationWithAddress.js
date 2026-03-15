import { useState } from 'react';

const useLocationWithAddress = () => {
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: '',
    placeId: '',
    loading: false,
    error: null
  });

  const getCurrentLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation not supported'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loading: false
        }));
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: 'Location access denied'
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const selectPlace = (place) => {
    if (!place.geometry) return;
    
    setLocation({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      address: place.formatted_address,
      placeId: place.place_id,
      loading: false,
      error: null
    });
  };

  return { location, getCurrentLocation, selectPlace };
};

export default useLocationWithAddress;