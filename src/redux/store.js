import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';  // For async actions
import { composeWithDevTools } from '@redux-devtools/extension'; // For Redux DevTools

// Import all reducers
import { uiReducer } from './reducers/uiReducer';
// We'll add more reducers later (cartReducer, authReducer, etc.)

// Combine all reducers
const rootReducer = combineReducers({
  ui: uiReducer,
  // cart: cartReducer,  // Will add later
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