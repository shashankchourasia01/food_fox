import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  CART_LOAD_REQUEST,
  CART_LOAD_SUCCESS,
  CART_LOAD_FAIL
} from '../constants/cartConstants';
import { addToCart as addToCartAPI, getCart, updateCartItem, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI } from '../../services/api';

// Load cart from backend
export const loadCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CART_LOAD_REQUEST });

    const { data } = await getCart();

    dispatch({
      type: CART_LOAD_SUCCESS,
      payload: data.data
    });
  } catch (error) {
    dispatch({
      type: CART_LOAD_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Add to cart with backend sync
export const addToCart = (productId, quantity) => async (dispatch) => {
  try {
    const { data } = await addToCartAPI(productId, quantity);
    dispatch({
      type: ADD_TO_CART,
      payload: data.data
    });
  } catch (error) {
    console.error('Add to cart error:', error);
  }
};

// Update quantity with backend sync
export const updateCartQuantity = (productId, quantity) => async (dispatch) => {
  try {
    const { data } = await updateCartItem(productId, quantity);
    
    dispatch({
      type: UPDATE_CART_QUANTITY,
      payload: data.data
    });
  } catch (error) {
    console.error('Update cart error:', error);
  }
};

// Remove from cart with backend sync
export const removeFromCart = (productId) => async (dispatch) => {
  try {
    const { data } = await removeFromCartAPI(productId);
    
    dispatch({
      type: REMOVE_FROM_CART,
      payload: data.data
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
  }
};

// Clear cart with backend sync
export const clearCart = () => async (dispatch) => {
  try {
    await clearCartAPI();
    
    dispatch({
      type: CLEAR_CART
    });
  } catch (error) {
    console.error('Clear cart error:', error);
  }
};