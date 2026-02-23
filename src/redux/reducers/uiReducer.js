import {
  OPEN_ACCOUNT_SIDEBAR,
  CLOSE_ACCOUNT_SIDEBAR
} from '../constants/uiConstants';

const initialState = {
  isAccountSidebarOpen: false
};

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_ACCOUNT_SIDEBAR:
      return {
        ...state,
        isAccountSidebarOpen: true
      };
    case CLOSE_ACCOUNT_SIDEBAR:
      return {
        ...state,
        isAccountSidebarOpen: false
      };
    default:
      return state;
  }
};