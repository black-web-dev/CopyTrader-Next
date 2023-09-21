import axios from 'axios';

import LocalStorage, { ACCESS_TOKEN } from '@/hooks/useStorage';

const Axios = axios.create({
  responseType: 'json',
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api_v1',
});

Axios.interceptors.request.use(function (options) {
  const token = LocalStorage.get(ACCESS_TOKEN, '');
  if (token) {
    options.headers['x-access-token'] = token;
  } else {
    options.headers['x-access-token'] = '';
  }
  return options;
});

Axios.interceptors.response.use((response) => response.data);

export default Axios;
