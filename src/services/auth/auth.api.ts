import LocalStorage, { USER_ID } from '@/hooks/useStorage';

import Axios from '../axios';

export function signinWithToken() {
  return Axios.post('/auth/access_token', {
    user_id: LocalStorage.get(USER_ID, ''),
  });
}

export function checkEmail({ email }: { email: string }) {
  return Axios.post('/auth/checkemail', {
    email,
  });
}

export function signin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return Axios.post('/auth/signin', { email, password });
}

export function signup({
  email,
  firstName,
  lastName,
  twitter_link,
  role,
  password,
  invite_code,
}: {
  email: string;
  firstName: string;
  lastName: string;
  twitter_link: string;
  role: string;
  password: string;
  invite_code?: string;
}) {
  return Axios.post('/auth/signup', {
    email,
    firstName,
    lastName,
    twitter_link,
    role,
    password,
    invite_code,
  });
}

export async function logout() {
  return Promise.resolve();
}

export function changePassword({
  user_id,
  oldPassword,
  newPassword,
}: {
  user_id: string;
  oldPassword: string;
  newPassword: string;
}) {
  return Axios.post('/user/change_password', {
    user_id: user_id,
    old_password: oldPassword,
    new_password: newPassword,
  });
}
