import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART
} from '../constants/cartConstants';

// Add to cart action
export const addToCart = (item) => (dispatch, getState) => {
  dispatch({
    type: ADD_TO_CART,
    payload: item
  });

  // Save to localStorage
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// Remove from cart
export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: REMOVE_FROM_CART,
    payload: id
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// Update quantity
export const updateCartQuantity = (id, quantity) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_CART_QUANTITY,
    payload: { id, quantity }
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// Clear cart
export const clearCart = () => (dispatch) => {
  dispatch({ type: CLEAR_CART });
  localStorage.removeItem('cartItems');
};