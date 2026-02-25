import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';  // For async actions
import { composeWithDevTools } from '@redux-devtools/extension'; // For Redux DevTools

// Import all reducers
import { uiReducer } from './reducers/uiReducer';
import { cartReducer } from './reducers/cartReducer';
import { authReducer } from './reducers/authReducer';

// Combine all reducers
const rootReducer = combineReducers({
  ui: uiReducer,
  cart: cartReducer,
  auth: authReducer 
  // auth: authReducer,  // Will add later
  // menu: menuReducer,  // Will add later
});

// Initial state (optional)
const initialState = {};

// Middleware setup
const middleware = [thunk];

// Create store
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;