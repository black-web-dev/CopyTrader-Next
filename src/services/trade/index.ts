import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import errorHandler from '@/lib/error-handler';

import { AppStore } from '@/services/index';

import {
  getCopyStatus,
  getCopyTraderAccount,
  startCopyTrader,
  stopCopyTrader,
} from './trade.api';

export type CopyStatusInfo = {
  id: number;
  from: string;
  to: string;
  collateral_ratio: number;
  leverage_ratio: number;
  from_timestamp: string;
  to_timestamp: string;
};

export type TradeStore = {
  isFetching: boolean;
  isStarting: boolean;
  isStoping: boolean;
  copyStatus: {
    isCopyTrading: boolean;
    message: string;
    info?: CopyStatusInfo;
  };
  copyTraderAccount: {
    message: string;
    copyAccount: string;
  };
  leader: string;
  collateral_ratio: number;
  leverage_ratio: number;
  collateral_limit_eth: string;
};

const initialState: TradeStore = {
  isFetching: false,
  isStarting: false,
  isStoping: false,
  copyStatus: {
    isCopyTrading: false,
    message: '',
    info: {
      id: 0,
      from: '',
      to: '',
      collateral_ratio: 1,
      leverage_ratio: 1,
      from_timestamp: '',
      to_timestamp: '',
    },
  },
  copyTraderAccount: {
    message: '',
    copyAccount: '',
  },
  leader: '',
  collateral_ratio: 0,
  leverage_ratio: 1.1,
  collateral_limit_eth: '10000000000000000',
};

export const getCopyStatusAsync = createAsyncThunk(
  'trade/getCopyStatus',
  getCopyStatus
);

export const startCopyTraderAsync = createAsyncThunk(
  'trade/startCopyTrader',
  errorHandler(startCopyTrader)
);

export const stopCopyTraderAsync = createAsyncThunk(
  'trade/stopCopyTrader',
  errorHandler(stopCopyTrader)
);

export const getCopyTraderAccountAsync = createAsyncThunk(
  'trade/getCopyTraderAccount',
  getCopyTraderAccount
);

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setCopyAccount: (state, action) => {
      state.copyTraderAccount.copyAccount = action.payload;
    },
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
        state.isFetching = true;
      })
      .addCase(getCopyStatusAsync.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(getCopyStatusAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        Object.assign(state.copyStatus, action.payload);
      })
      .addCase(getCopyTraderAccountAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getCopyTraderAccountAsync.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(getCopyTraderAccountAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        Object.assign(state.copyTraderAccount, action.payload);
      })
      .addCase(startCopyTraderAsync.pending, (state) => {
        state.isStarting = true;
      })
      .addCase(startCopyTraderAsync.rejected, (state) => {
        state.isStarting = false;
      })
      .addCase(startCopyTraderAsync.fulfilled, (state) => {
        state.isStarting = false;
      })
      .addCase(stopCopyTraderAsync.pending, (state) => {
        state.isStoping = true;
      })
      .addCase(stopCopyTraderAsync.rejected, (state) => {
        state.isStoping = false;
      })
      .addCase(stopCopyTraderAsync.fulfilled, (state) => {
        state.isStoping = false;
      });
  },
});

export const {
  setLeader,
  setCopyAccount,
  setCollateralRatio,
  setLeverageRatio,
} = tradeSlice.actions;

export const selectTradeDetail = (state: AppStore) => state.trade;

export default tradeSlice.reducer;
