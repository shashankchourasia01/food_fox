import {
  OPEN_ACCOUNT_SIDEBAR,
  CLOSE_ACCOUNT_SIDEBAR
} from '../constants/uiConstants';

export const openAccountSidebar = () => (dispatch) => {
  dispatch({ type: OPEN_ACCOUNT_SIDEBAR });
};

export const closeAccountSidebar = () => (dispatch) => {
  dispatch({ type: CLOSE_ACCOUNT_SIDEBAR });
};