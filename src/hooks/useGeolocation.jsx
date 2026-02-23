import { useState, useEffect } from 'react';
import axios from 'axios';

const useGeolocation = () => {
  const [location, setLocation] = useState({
    address: 'Detecting your location...',
    coordinates: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Pehle check karo localStorage mein address hai ya nahi
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      setLocation({
        address: savedAddress,
        coordinates: JSON.parse(localStorage.getItem('userCoordinates')),
        loading: false,
        error: null
      });
      return;
    }

    // Agar nahi hai to geolocation fetch karo
    if (!navigator.geolocation) {
      setLocation({
        address: 'Geolocation not supported',
        coordinates: null,
        loading: false,
        error: 'Geolocation not supported'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding using OpenStreetMap (free)
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          
          const address = response.data.display_name || 
                         `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          // LocalStorage mein save karo
          localStorage.setItem('userAddress', address);
          localStorage.setItem('userCoordinates', JSON.stringify({ latitude, longitude }));
          
          setLocation({
            address: address,
            coordinates: { latitude, longitude },
            loading: false,
            error: null
          });
        } catch (error) {
          setLocation({
            address: 'Location detected but address fetch failed',
            coordinates: null,
            loading: false,
            error: 'Failed to fetch address'
          });
        }
      },
      (error) => {
        let errorMessage = 'Location access denied';
        if (error.code === 1) {
          errorMessage = 'Please allow location access';
        }
        setLocation({
          address: 'Location access denied',
          coordinates: null,
          loading: false,
          error: errorMessage
        });
      }
    );
  }, []);

  return location;
};

export default useGeolocation;