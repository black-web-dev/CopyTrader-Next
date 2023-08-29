import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import errorHandler from '@/lib/error-handler';
import LocalStorage, { ACCESS_TOKEN, USER_ID } from '@/hooks/useStorage';

import { AppStore } from '@/services/index';

import { logout, signin, signinWithToken, signup } from './auth.api';

export type AuthStore = {
  accessToken: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  status: string;
};

const initialState: AuthStore = {
  accessToken: LocalStorage.get(ACCESS_TOKEN, ''),
  user: {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
  },
  status: 'auth_check',
};

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  errorHandler(signinWithToken)
);
export const signinAsync = createAsyncThunk(
  'auth/signin',
  errorHandler(signin)
);
export const signupAsync = createAsyncThunk(
  'auth/signup',
  errorHandler(signup)
);
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  errorHandler(logout)
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      LocalStorage.set(ACCESS_TOKEN, state.accessToken);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setGlobalLoading: (state, action) => {
      if (action.payload !== true) {
        state.status = 'idle';
      } else {
        state.status = 'auth_check';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = 'auth_check';
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        Object.assign(state, action.payload.data);
        LocalStorage.set(ACCESS_TOKEN, state.accessToken);
        LocalStorage.set(USER_ID, state.user.id);
      })
      .addCase(checkAuthAsync.rejected, (state, _) => {
        state.status = 'idle';
        state.accessToken = '';
        LocalStorage.remove(ACCESS_TOKEN);
      })
      .addCase(signinAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signinAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        Object.assign(state, action.payload.data);
        LocalStorage.set(ACCESS_TOKEN, state.accessToken);
        LocalStorage.set(USER_ID, state.user.id);
      })
      .addCase(signupAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        Object.assign(state, action.payload.data);
        LocalStorage.set(ACCESS_TOKEN, state.accessToken);
        LocalStorage.set(USER_ID, state.user.id);
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.accessToken = '';
        state.user = {
          id: 0,
          firstName: '',
          lastName: '',
          email: '',
          role: 'user',
        };
        LocalStorage.remove(ACCESS_TOKEN);
      });
  },
});

export const { setAccessToken, setStatus, setGlobalLoading } =
  authSlice.actions;

export const selectAccessToken = (state: AppStore) => state.auth.accessToken;
export const selectUserdata = (state: AppStore) => state.auth.user;
export const selectAuthStatus = (state: AppStore) => state.auth.status;

export default authSlice.reducer;
