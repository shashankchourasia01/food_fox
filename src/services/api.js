import axios from 'axios';

// Backend URL - .env file se ya direct
// const API_URL = 'http://localhost:5000/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - har request se pehle
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (jab implement hoga)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - response aane ke baad
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server ne response diya but error status ke saath
      console.error('❌ Error:', error.response.data);
      
      // 401 Unauthorized - token expire ho gaya
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request bheji but response nahi aaya
      console.error('❌ No response from server');
    } else {
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================
// API FUNCTIONS
// ============================================

// 📌 Test API
export const testAPI = () => api.get('/');

// 📌 User APIs
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ============================================
// AUTH APIS - Add these with other API functions
// ============================================

// 📌 Send OTP
export const sendOTP = (userData) => api.post('/auth/send-otp', userData);

// 📌 Verify OTP
export const verifyOTP = (data) => api.post('/auth/verify-otp', data);

// 📌 Resend OTP
export const resendOTP = (phone) => api.post('/auth/resend-otp', { phone });

// 📌 Get User Profile (after login)
export const getUserProfile = () => api.get('/auth/profile');

// 📌 Logout
export const logout = () => api.post('/auth/logout');

// 📌 Product APIs (will add later)
export const getProducts = (params = {}) => {
  // Convert params object to query string
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/products${queryString ? `?${queryString}` : ''}`);
};

// Get single product
export const getProductById = (id) => api.get(`/products/${id}`);

// Get all categories
export const getCategories = () => api.get('/products/categories');

// Get featured products
export const getFeaturedProducts = () => api.get('/products/featured');

// Admin functions (protected)
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);


// CART APIS
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity = 1) => 
  api.post('/cart/items', { productId, quantity });
export const updateCartItem = (productId, quantity) => 
  api.put(`/cart/items/${productId}`, { quantity });
export const removeFromCart = (productId) => 
  api.delete(`/cart/items/${productId}`);
export const clearCart = () => api.delete('/cart');


// ORDER APIS

export const createOrder = (orderData) => api.post('/orders', orderData);
export const getMyOrders = () => api.get('/orders/my-orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const cancelOrder = (id, reason) => 
  api.put(`/orders/${id}/cancel`, { reason });
export const trackOrder = (id) => api.get(`/orders/${id}/track`);


// 📌 Feedback APIs (will add later)
// export const submitFeedback = (feedback) => api.post('/feedback', feedback);

export default api;