import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  CART_LOAD_REQUEST,
  CART_LOAD_SUCCESS,
  CART_LOAD_FAIL
} from '../constants/cartConstants';

// Load cart from localStorage (as backup)
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialState = {
  cartItems: cartItemsFromStorage,
  loading: false,
  error: null
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_LOAD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case CART_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: action.payload.items || [],
        error: null
      };

    case CART_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ADD_TO_CART:
      return {
        ...state,
        cartItems: action.payload.items || state.cartItems,
        loading: false
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: action.payload.items || state.cartItems.filter(x => x.product !== action.payload),
        loading: false
      };

    case UPDATE_CART_QUANTITY:
      return {
        ...state,
        cartItems: action.payload.items || state.cartItems,
        loading: false
      };

    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
        loading: false
      };

    default:
      return state;
  }
};