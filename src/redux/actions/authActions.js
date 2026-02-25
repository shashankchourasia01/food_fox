import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  OTP_REQUEST,
  OTP_SUCCESS,
  OTP_FAIL,
  LOGOUT
} from '../constants/authConstants';

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
export const verifyOTP = (otp, name, phone) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    
    // Simulate verification - replace with actual API
    setTimeout(() => {
      // Mock successful login
      const userData = {
        name: name,
        phone: phone,
        isAuthenticated: true
      };
      
      // Save to localStorage
      localStorage.setItem('userInfo', JSON.stringify(userData));
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: userData
      });
    }, 1000);
    
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.message
    });
  }
};

// Logout action
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  sessionStorage.removeItem('tempPhone');
  dispatch({ type: LOGOUT });
};