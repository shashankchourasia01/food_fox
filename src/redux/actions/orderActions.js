import api from '../../services/api';
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  GET_ORDERS_REQUEST,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAIL
} from '../constants/orderConstants';

// Create new order
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });

    const { data } = await api.post('/orders', orderData);

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data.data
    });

    // Clear cart after successful order
    dispatch({ type: 'CLEAR_CART' });

    return data.data; // Return for component use

  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

// Get user orders
export const getMyOrders = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ORDERS_REQUEST });

    const { data } = await api.get('/orders/my-orders');

    dispatch({
      type: GET_ORDERS_SUCCESS,
      payload: data.data
    });

    return data.data;

  } catch (error) {
    dispatch({
      type: GET_ORDERS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

// Get single order by ID
export const getOrderById = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_ORDERS_REQUEST });

    const { data } = await api.get(`/orders/${id}`);

    dispatch({
      type: GET_ORDERS_SUCCESS,
      payload: data.data
    });

    return data.data;

  } catch (error) {
    dispatch({
      type: GET_ORDERS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

// Cancel order
export const cancelOrder = (id, reason) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });

    const { data } = await api.put(`/orders/${id}/cancel`, { reason });

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data.data
    });

    return data.data;

  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};