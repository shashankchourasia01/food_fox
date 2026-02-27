import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  OTP_REQUEST,
  OTP_SUCCESS,
  OTP_FAIL,
  LOGOUT
} from '../constants/authConstants';

// ✅ localStorage se user data load karo
const userInfoFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const tokenFromStorage = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : null;

const initialState = {
  user: userInfoFromStorage,  // ✅ localStorage se user load hoga
  token: tokenFromStorage,    // ✅ token bhi load karo
  loading: false,
  error: null,
  otpSent: false,
  otpLoading: false
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    
    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case OTP_REQUEST:
      return {
        ...state,
        otpLoading: true,
        otpSent: false,
        error: null
      };
    
    case OTP_SUCCESS:
      return {
        ...state,
        otpLoading: false,
        otpSent: true,
        error: null
      };
    
    case OTP_FAIL:
      return {
        ...state,
        otpLoading: false,
        otpSent: false,
        error: action.payload
      };
    
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        otpSent: false
      };
    
    default:
      return state;
  }
};