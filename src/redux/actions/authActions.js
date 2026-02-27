import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  OTP_REQUEST,
  OTP_SUCCESS,
  OTP_FAIL,
  LOGOUT
} from '../constants/authConstants';
import axios from 'axios';

// Send OTP action
export const sendOTP = (phone) => async (dispatch) => {
  try {
    dispatch({ type: OTP_REQUEST });
    
    // Simulate API call - replace with actual API
    setTimeout(() => {
      // Store phone in session storage
      sessionStorage.setItem('tempPhone', phone);
      
      dispatch({
        type: OTP_SUCCESS,
        payload: { message: 'OTP sent successfully' }
      });
    }, 1000);
    
  } catch (error) {
    dispatch({
      type: OTP_FAIL,
      payload: error.message
    });
  }
};

// Verify OTP and Login
// Verify OTP and Login
export const verifyOTP = (otp, name, phone) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    
    // API call
    const response = await axios.post('/api/auth/verify-otp', {
      phone,
      otp,
      name
    });
    
    const { user, token } = response.data.data;
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user, token }  // ✅ Send both user and token
    });
    
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response?.data?.message || 'Verification failed'
    });
  }
};

// Logout action
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  sessionStorage.removeItem('tempPhone');
  dispatch({ type: LOGOUT });
};