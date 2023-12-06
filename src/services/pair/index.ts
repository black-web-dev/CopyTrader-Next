import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import LocalStorage from '@/hooks/useStorage';

import { AppStore } from '@/services/index';

import { getETHDetail, getPairDetail } from './pair.api';

const PAIR_KEY = 'pair';

export const pairs: PairType[] = [
  {
    label: 'ETH/USD',
    symbol: 'ETHUSDT',
    ticket: 'BINANCE:ETHUSD',
  },
  {
    label: 'BTC/USD',
    symbol: 'BTCUSDT',
    ticket: 'BINANCE:BTCUSD',
  },
  {
    label: 'LINK/USD',
    symbol: 'LINKUSDT',
    ticket: 'BINANCE:LINKUSD',
  },
  {
    label: 'UNI/USD',
    symbol: 'UNIUSDT',
    ticket: 'BINANCE:UNIUSD',
  },
];

export type PairType = {
  label: string;
  symbol: string;
  ticket: string;
};

export type CurrentPairDetail = {
  currentPrice: number;
  highPrice: number;
  lowPrice: number;
  averagePrice: number;
  change: number;
};

export type PairStore = {
  isFetching: boolean;
  currentPair: PairType;
  currentPairDetail: CurrentPairDetail;
  ethDetail: CurrentPairDetail;
};

export const initialState: PairStore = {
  isFetching: false,
  currentPair: pairs[LocalStorage.get(PAIR_KEY, '') || 0],
  currentPairDetail: {
    currentPrice: 0,
    highPrice: 0,
    lowPrice: 0,
    averagePrice: 0,
    change: 0,
  },
  ethDetail: {
    currentPrice: 0,
    highPrice: 0,
    lowPrice: 0,
    averagePrice: 0,
    change: 0,
  },
};

export const getPairDetailAsync = createAsyncThunk(
  'pair/getPairDetail',
  getPairDetail
);

export const getETHDetailAsync = createAsyncThunk(
  'pair/getETHDetail',
  getETHDetail
);

const pairSlice = createSlice({
  name: 'paire',
  initialState,
  reducers: {
    seCurrentPair: (state, action) => {
      Object.assign(state.currentPair, pairs[action.payload]);
      LocalStorage.set(PAIR_KEY, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPairDetailAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getPairDetailAsync.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(getPairDetailAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        Object.assign(state.currentPairDetail, action.payload);
      })
      .addCase(getETHDetailAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getETHDetailAsync.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(getETHDetailAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        Object.assign(state.ethDetail, action.payload);
      });
  },
});

export const { seCurrentPair } = pairSlice.actions;

export const selectCurrentPair = (state: AppStore) => state.pair.currentPair;

export const selectCurrentPairDetail = (state: AppStore) =>
  state.pair.currentPairDetail;

export const selectETHDetail = (state: AppStore) => state.pair.ethDetail;

export default pairSlice.reducer;
