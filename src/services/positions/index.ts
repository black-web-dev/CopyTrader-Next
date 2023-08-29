import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import errorHandler from '@/lib/error-handler';

import { AppStore } from '@/services/index';
import { closePosition, getPositions } from './positions.api';

export type Position = {
  indextoken: number;
  coloateral: number;
  pnl: number;
  size: number;
  averageprice: number;
  price: number;
  limit_price: number;
  islong: boolean;
};

export type PositionStore = {
  busy: boolean;
  items: Position[];
};

const initialState: PositionStore = {
  busy: false,
  items: [],
};

export const getPositionsAsync = createAsyncThunk(
  'positions/getPositions',
  errorHandler(getPositions)
);

export const closePositionAsync = createAsyncThunk(
  'positions/closePosition',
  errorHandler(closePosition)
);

const positionSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPositionsAsync.pending, (state) => {
        state.busy = true;
      })
      .addCase(getPositionsAsync.rejected, (state) => {
        state.busy = false;
      })
      .addCase(getPositionsAsync.fulfilled, (state, action) => {
        state.busy = false;
        Object.assign(state, action.payload.data);
      })
      .addCase(closePositionAsync.pending, (state) => {
        state.busy = true;
      })
      .addCase(closePositionAsync.rejected, (state) => {
        state.busy = false;
      })
      .addCase(closePositionAsync.fulfilled, (state) => {
        state.busy = false;
      });
  },
});

export const selectPositions = (state: AppStore) => state.position.items;

export default positionSlice.reducer;
