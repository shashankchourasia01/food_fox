import { combineReducers } from 'redux';
import { uiReducer } from './reducers/uiReducer';
// ... other reducers

export default combineReducers({
  ui: uiReducer,
  // ... other reducers
});