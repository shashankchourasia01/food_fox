import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const useDeliveryCheck = () => {
  const [deliveryStatus, setDeliveryStatus] = useState({
    isDeliverable: null,
    distance: null,
    maxDistance: null,
    area: null,
    loading: false,
    error: null,
    showPopup: false
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const checkDelivery = useCallback(async (lat, lng) => {
    // Agar coordinates नहीं हैं तो loading false करो
    if (!lat || !lng) {
      console.log('📍 No coordinates provided to checkDelivery');
      setDeliveryStatus(prev => ({
        ...prev,
        loading: false,
        isDeliverable: null,
        error: 'No location coordinates'
      }));
      return;
    }

    // console.log(`📍 Checking delivery for coordinates: ${lat}, ${lng}`);
    setDeliveryStatus(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.post(`${API_URL}/delivery/check`, { lat, lng });
      // console.log('✅ Delivery check response:', response.data);
      
      setDeliveryStatus({
        ...response.data.data,
        loading: false,
        error: null,
        showPopup: true
      });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setDeliveryStatus(prev => ({ ...prev, showPopup: false }));
      }, 5000);

    } catch (error) {
      console.error('❌ Delivery check error:', error);
      setDeliveryStatus({
        isDeliverable: null,
        distance: null,
        maxDistance: null,
        area: null,
        loading: false,
        error: 'Failed to check delivery availability',
        showPopup: true
      });

      timeoutRef.current = setTimeout(() => {
        setDeliveryStatus(prev => ({ ...prev, showPopup: false }));
      }, 5000);
    }
  }, [API_URL]);

  const hidePopup = useCallback(() => {
    setDeliveryStatus(prev => ({ ...prev, showPopup: false }));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return {
    deliveryStatus,
    checkDelivery,
    hidePopup
  };
};

export default useDeliveryCheck;