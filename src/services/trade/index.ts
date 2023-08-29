import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import errorHandler from '@/lib/error-handler';

import { AppStore } from '@/services/index';

import { getCopyStatus, startCopyTrader, stopCopyTrader } from './trade.api';

export type TradeStore = {
  copyStatus: {
    copy: boolean;
    leader: {
      from: string;
      collateral_ratio: number;
      leverage_ratio: number;
    };
  };
  leader: string;
  collateral_ratio: number;
  leverage_ratio: number;
  collateral_limit_eth: string;
  busy: boolean;
  seed: number;
};

const initialState: TradeStore = {
  copyStatus: {
    copy: false,
    leader: {
      from: '',
      collateral_ratio: 0,
      leverage_ratio: 1.2,
    },
  },
  leader: '',
  collateral_ratio: 0,
  leverage_ratio: 1.2,
  collateral_limit_eth: '10000000000000000',
  busy: false,
  seed: 0,
};

export const getCopyStatusAsync = createAsyncThunk(
  'trade/getCopyStatus',
  errorHandler(getCopyStatus)
);

export const startCopyTraderAsync = createAsyncThunk(
  'trade/startCopyTrader',
  errorHandler(startCopyTrader)
);

export const stopCopyTraderAsync = createAsyncThunk(
  'trade/stopCopyTrader',
  errorHandler(stopCopyTrader)
);

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setLeader: (state, action) => {
      state.leader = action.payload;
    },
    setCollateralRatio: (state, action) => {
      state.collateral_ratio = action.payload;
    },
    setLeverageRatio: (state, action) => {
      state.leverage_ratio = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCopyStatusAsync.pending, (state) => {
        state.busy = true;
      })
      .addCase(getCopyStatusAsync.rejected, (state) => {
        state.busy = false;
      })
      .addCase(getCopyStatusAsync.fulfilled, (state, action) => {
        state.busy = false;
        Object.assign(state, action.payload.data);
      })
      .addCase(startCopyTraderAsync.pending, (state) => {
        state.busy = true;
      })
      .addCase(startCopyTraderAsync.rejected, (state) => {
        state.busy = false;
      })
      .addCase(startCopyTraderAsync.fulfilled, (state) => {
        state.busy = false;
      })

      .addCase(stopCopyTraderAsync.pending, (state) => {
        state.busy = true;
      })
      .addCase(stopCopyTraderAsync.rejected, (state) => {
        state.busy = false;
      })
      .addCase(stopCopyTraderAsync.fulfilled, (state) => {
        state.busy = false;
      });
  },
});

export const { setLeader, setCollateralRatio, setLeverageRatio } =
  tradeSlice.actions;

export const selectTradeDetail = (state: AppStore) => state.trade;

export default tradeSlice.reducer;
