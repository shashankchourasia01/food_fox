import { useState, useEffect } from 'react';

const useGoogleMaps = () => {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(null);

  useEffect(() => {
    let isMounted = true; // ✅ Flag to prevent memory leaks

    const loadMaps = () => {
      // Check if already loaded
      if (window.google?.maps) {
        if (isMounted) {
          setMapsLoaded(true);
        }
        return;
      }

      // Define callback function
      window.initMap = () => {
        if (isMounted) {
          setMapsLoaded(true);
        }
      };

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,geometry&loading=async&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        if (isMounted) {
          setMapsError('Failed to load Google Maps');
        }
      };

      document.head.appendChild(script);
    };

    loadMaps();

    // Cleanup function
    return () => {
      isMounted = false; // Prevent state updates after unmount
      const scriptElement = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (scriptElement) {
        scriptElement.remove();
      }
      delete window.initMap;
    };
  }, []);

  return { mapsLoaded, mapsError };
};

export default useGoogleMaps;