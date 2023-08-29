import LocalStorage, { USER_ID } from '@/hooks/useStorage';

import Axios from '../axios';

export function signinWithToken() {
  return Axios.post('/api/auth/access_token', {
    user_id: LocalStorage.get(USER_ID, ''),
  });
}

export function signin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return Axios.post('/api/auth/signin', { email, password });
}

export function signup({
  email,
  firstName,
  lastName,
  twitter_link,
  role,
  password,
}: {
  email: string;
  firstName: string;
  lastName: string;
  twitter_link: string;
  role: string;
  password: string;
}) {
  return Axios.post('/api/auth/signup', {
    email,
    firstName,
    lastName,
    twitter_link,
    role,
    password,
  });
}

export async function logout() {
  return Promise.resolve();
}
