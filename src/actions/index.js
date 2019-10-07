import axios from 'axios';

export const getStatus = () => async dispatch => {
  const res = await axios.get('/api/user/status');

  if (res.data.userId) {
    dispatch({
      type: 'USER_STATUS',
      payload: true
    });

    dispatch({
      type: 'USER',
      payload: res.data
    });
  } else {
    dispatch({
      type: 'USER_STATUS',
      payload: false
    });
  }
};

export const login = (usn, psw) => async dispatch => {
  const res = await axios.post('/api/user/login', {
    userName: usn,
    password: psw
  });

  const { message, userState, userId } = res.data;

  if (message === 'success') {
    dispatch({
      type: 'USER_STATUS',
      payload: true
    });

    dispatch({
      type: 'USER',
      payload: {
        userState,
        userId
      }
    });
  }

  return message;
};

export const logout = () => async dispatch => {
  const res = await axios.get('/api/user/logout');
  const { message } = res.data;

  if (res.status === 200) {
    dispatch({
      type: 'USER_STATUS',
      payload: false
    });

    dispatch({
      type: 'CLEAR_USER',
      payload: {
        userId: -1
      }
    });
  }

  return message;
};
