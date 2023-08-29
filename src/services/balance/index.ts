import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import errorHandler from '@/lib/error-handler';

import { AppStore } from '@/services/index';

import { getBalance } from './balance.api';

export type BalanceStore = {
  balance: number;
};

const initialState: BalanceStore = {
  balance: 0,
};

export const getBalanceAsync = createAsyncThunk(
  'balance/getBalance',
  errorHandler(getBalance)
);

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBalanceAsync.fulfilled, (state, action) => {
      state.balance = action.payload.data.data.balance_eth;
    });
  },
});

export const selectBalance = (state: AppStore) => state.balance.balance;

export default balanceSlice.reducer;
