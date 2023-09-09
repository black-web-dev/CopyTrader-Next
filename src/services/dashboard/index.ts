import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import errorHandler from '@/lib/error-handler';

import { AppStore } from '@/services/index';
import { bnum } from '@/utils';

import { getChainInfo, getTopTraders, getTransactions } from './dashboard.api';

export type ChainInfoStatusType = {
  active: boolean;
  chain_info: {
    arbPrice: number;
    arbPriceChangePercentage24h: number;
    arbPriceChange_24h: number;
    avgGasPrice: number;
    latestBlock: number;
    marketCap: number;
    volume24h: number;
  };
};

export type TopTraderType = {
  action: number;
  account: string;
  win: number;
  loss: number;
  size: number;
  collateral: number;
  realisedpnl: number;
  leverage: number;
  count: number;
  wind_loss: number;
  avg_leverage: number;
  avg_coli: number;
};

export type TransactionType = {
  action: number;
  account: string;
  index_token: string;
  is_long: boolean;
  size_delta: string;
  collateral_delta: string;
  timestamp: string;
  transaction_hash: string;
};

export type DashboardStore = {
  isFetching: boolean;
  isFetchingTopTraders: boolean;
  isFetchingTransactions: boolean;
  chainInfoStatus: ChainInfoStatusType;
  topTraderStatus: {
    count: number;
    data: TopTraderType[];
  };
  transactionStatus: {
    total_count: number;
    list: TransactionType[];
  };
  sort: string;
  offset: number;
  limit: number;
};

const initialState: DashboardStore = {
  isFetching: false,
  isFetchingTopTraders: false,
  isFetchingTransactions: false,
  chainInfoStatus: {
    active: false,
    chain_info: {
      arbPrice: 0,
      arbPriceChangePercentage24h: 0,
      arbPriceChange_24h: 0,
      avgGasPrice: 0,
      latestBlock: 0,
      marketCap: 0,
      volume24h: 0,
    },
  },
  topTraderStatus: {
    count: 0,
    data: [],
  },
  transactionStatus: {
    total_count: 0,
    list: [],
  },
  sort: 'timestamp-desc',
  offset: 1,
  limit: 10,
};

export const getChainInfoAsync = createAsyncThunk(
  'dashabord/getChainInfo',
  errorHandler(getChainInfo)
);

export const getTopTradersAsync = createAsyncThunk(
  'dashboard/getTopTraders',
  errorHandler(getTopTraders)
);

export const getTransactionsAsync = createAsyncThunk(
  'dashboard/getTransactions',
  errorHandler(getTransactions)
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setOffset: (state, action) => {
      state.offset = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChainInfoAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getChainInfoAsync.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(getChainInfoAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        Object.assign(state.chainInfoStatus, action.payload.data);
      })
      .addCase(getTopTradersAsync.pending, (state) => {
        state.isFetchingTopTraders = true;
      })
      .addCase(getTopTradersAsync.rejected, (state) => {
        state.isFetchingTopTraders = false;
      })
      .addCase(getTopTradersAsync.fulfilled, (state, action) => {
        state.isFetchingTopTraders = false;
        Object.assign(state.topTraderStatus, action.payload.data);
      })
      .addCase(getTransactionsAsync.pending, (state) => {
        state.isFetchingTransactions = true;
      })
      .addCase(getTransactionsAsync.rejected, (state) => {
        state.isFetchingTransactions = false;
      })
      .addCase(getTransactionsAsync.fulfilled, (state, action) => {
        state.isFetchingTransactions = false;
        Object.assign(state.transactionStatus, action.payload.data);
      });
  },
});

export const { setOffset, setSort } = dashboardSlice.actions;

export const selectIsFetching = (state: AppStore) => state.dashboard.isFetching;

export const selectIsFetchingTopTraders = (state: AppStore) =>
  state.dashboard.isFetchingTopTraders;

export const selectIsFetchingTransactions = (state: AppStore) =>
  state.dashboard.isFetchingTransactions;

export const selectChainInfoStatus = (state: AppStore) =>
  state.dashboard.chainInfoStatus;

export const selectTopTraderStatus = (state: AppStore) =>
  state.dashboard.topTraderStatus;

export const selectTransactionData = (state: AppStore) => {
  const sorted: TransactionType[] = [...state.dashboard.transactionStatus.list];

  const sort = state.dashboard.sort.split('-');
  const sortKey = sort[0];
  const sortDireaction = sort[1];

  if (sortKey && sortDireaction) {
    sorted.sort((a: TransactionType, b: TransactionType) => {
      const compareA = bnum(a[sortKey as keyof TransactionType]);
      const compareB = bnum(b[sortKey as keyof TransactionType]);

      // if (typeof compareA === 'string' && typeof compareB === 'string') {
      //   compareA = compareA.toLowerCase()
      //   compareB = compareB.toLowerCase()
      // }

      if (compareB.gt(compareA)) {
        return sortDireaction === 'desc' ? 1 : -1;
      }
      if (compareA.gt(compareB)) {
        return sortDireaction === 'desc' ? -1 : 1;
      }
      return 0;
    });
  }

  return {
    count: state.dashboard.transactionStatus.total_count,
    list: sorted,
  };
};
export const selectLimit = (state: AppStore) => state.dashboard.limit;

export const selectOffset = (state: AppStore) => state.dashboard.offset;

export const selectSort = (state: AppStore) => state.dashboard.sort;

export default dashboardSlice.reducer;
