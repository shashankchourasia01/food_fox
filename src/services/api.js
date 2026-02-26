import axios from 'axios';

// Backend URL - .env file se ya direct
const API_URL = 'http://localhost:5000/api';

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
// export const getProducts = () => api.get('/products');
// export const getProductById = (id) => api.get(`/products/${id}`);

// 📌 Order APIs (will add later)
// export const getOrders = () => api.get('/orders');
// export const createOrder = (orderData) => api.post('/orders', orderData);

// 📌 Cart APIs (will add later)
// export const getCart = () => api.get('/cart');
// export const addToCart = (item) => api.post('/cart', item);
// export const updateCart = (id, quantity) => api.put(`/cart/${id}`, { quantity });
// export const removeFromCart = (id) => api.delete(`/cart/${id}`);

// 📌 Feedback APIs (will add later)
// export const submitFeedback = (feedback) => api.post('/feedback', feedback);

export default api;