import axios from 'axios';

const baseUrl = '/api';

const server = axios.create({
  baseURL: baseUrl
});

export const getStatus = async () => {
  return await server.get('/status');
};

export const login = async (usn, psw) => {
  const res = await server.post('/user/login', {
    userName: usn,
    password: psw
  });

  if (res.status === 200) {
    return res.data;
  }

  return res;
};
