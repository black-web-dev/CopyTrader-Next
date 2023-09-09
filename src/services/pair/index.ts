import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import LocalStorage from '@/hooks/useStorage';

import { AppStore } from '@/services/index';

import { getPairDetail } from './pair.api';

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
};

export const getPairDetailAsync = createAsyncThunk(
  'pair/getPairDetail',
  getPairDetail
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
      });
  },
});

export const { seCurrentPair } = pairSlice.actions;

export const selectCurrentPair = (state: AppStore) => state.pair.currentPair;

export const selectCurrentPairDetail = (state: AppStore) =>
  state.pair.currentPairDetail;

export default pairSlice.reducer;
