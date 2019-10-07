import { combineReducers } from 'redux';

const userReducers = (state = { userId: -1 }, action) => {
  switch (action.type) {
    case 'USER':
      return { ...state, ...action.payload };
    case 'CLEAR_USER':
      return action.payload;
    default:
      return state;
  }
};

const statusReducers = (state = false, action) => {
  if (action.type === 'USER_STATUS') {
    return action.payload;
  } else {
    return state;
  }
};

export default combineReducers({
  isLogin: statusReducers,
  user: userReducers
});
