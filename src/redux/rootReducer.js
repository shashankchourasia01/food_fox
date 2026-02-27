import { combineReducers } from 'redux';
import { uiReducer } from './reducers/uiReducer';
import { cartReducer } from './reducers/cartReducer';
import { authReducer } from './reducers/authReducer';
import { orderReducer } from './reducers/orderReducer'; // ✅ Add this

export default combineReducers({
  ui: uiReducer,           // UI state (sidebar, modals, etc.)
  cart: cartReducer,       // Cart items, loading, error
  auth: authReducer,       // User authentication state
  order: orderReducer,      // Orders state
});