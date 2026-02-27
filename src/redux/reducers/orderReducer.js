import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  GET_ORDERS_REQUEST,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAIL,
  GET_ORDER_DETAILS_REQUEST,
  GET_ORDER_DETAILS_SUCCESS,
  GET_ORDER_DETAILS_FAIL
} from '../constants/orderConstants';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
    case GET_ORDERS_REQUEST:
    case GET_ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        currentOrder: action.payload,
        orders: [action.payload, ...state.orders],
        error: null
      };

    case GET_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
        error: null
      };

    case GET_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        currentOrder: action.payload,
        error: null
      };

    case CREATE_ORDER_FAIL:
    case GET_ORDERS_FAIL:
    case GET_ORDER_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};