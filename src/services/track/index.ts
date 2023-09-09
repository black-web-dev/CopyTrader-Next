import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import errorHandler from '@/lib/error-handler';

import { AppStore } from '@/services/index';
import { bnum } from '@/utils';

import { getClosedPositions, getOpenedPositions } from './track.api';

export type TrackItemType = {
  action: number;
  account: string;
  win: number;
  loss: number;
  size: number;
  collateral: number;
  realisedpnl: number;
  leverage: number;
  count: number;
  win_loss: number;
  avg_leverage: number;
  avg_coll: number;
};

export type TrackDataType = {
  count: number;
  data: TrackItemType[];
};

export type FilterType = {
  user_id: string;
  chain: string;
  protocol: string;
  wallet_amount: number[];
  trade_size: number[];
  leverage: number[];
  side?: string;
  win_loss_min?: number;
  period: string;
  status?: string;
};

export type TrackStore = {
  isFetching: boolean;
  trackdata: TrackDataType;
  filter: FilterType;
  searchAddress: string;
  sort: string;
  page: number;
  pageSize: number;
};

export const initialState: TrackStore = {
  isFetching: false,
  trackdata: {
    count: 0,
    data: [],
  },
  filter: {
    user_id: '0',
    chain: 'arbitrum',
    protocol: 'GMX',
    wallet_amount: [0, 1e270],
    trade_size: [0, 1e270],
    leverage: [0, 50],
    side: 'long',
    win_loss_min: 0,
    period: '86400',
    status: 'close',
  },
  searchAddress: '',
  sort: 'size-desc',
  page: 1,
  pageSize: 10,
};

export const getClosedPositionsAsync = createAsyncThunk(
  'track/getClosedPositions',
  errorHandler(getClosedPositions)
);

export const getOpenedPositionsAsync = createAsyncThunk(
  'track/getOpenedPositions',
  errorHandler(getOpenedPositions)
);

const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      Object.assign(state.filter, action.payload);
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearchAddress: (state, action) => {
      state.searchAddress = action.payload;
    },
    setTrackDataCount: (state, action) => {
      state.trackdata.count = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClosedPositionsAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getClosedPositionsAsync.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(getClosedPositionsAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        Object.assign(state.trackdata, action.payload.data);
      });
  },
});

export const { setFilter, setSort, setPage, setSearchAddress } =
  trackSlice.actions;

export const selectTrackData = (state: AppStore) => {
  let sorted: TrackItemType[] = [...state.track.trackdata.data];

  const sort = state.track.sort.split('-');
  const sortKey = sort[0];
  const sortDireaction = sort[1];

  if (sortKey && sortDireaction) {
    sorted.sort((a: TrackItemType, b: TrackItemType) => {
      const compareA = bnum(a[sortKey as keyof TrackItemType]);
      const compareB = bnum(b[sortKey as keyof TrackItemType]);

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

  if (state.track.searchAddress) {
    sorted = sorted.filter(
      (item) => item.account === state.track.searchAddress
    );
  }
  const count = sorted.length;
  const start = (state.track.page - 1) * state.track.pageSize;
  const end = Math.min(
    (state.track.page - 1) * state.track.pageSize + state.track.pageSize,
    count
  );

  return {
    count,
    list: sorted.slice(start, end),
  };
};

export const selectFilter = (state: AppStore) => state.track.filter;
export const selectIsFetching = (state: AppStore) => state.track.isFetching;

export const selectPage = (state: AppStore) => state.track.page;
export const selectPageSize = (state: AppStore) => state.track.pageSize;
export const selectSort = (state: AppStore) => state.track.sort;

export const selectSearchAddress = (state: AppStore) =>
  state.track.searchAddress;

export default trackSlice.reducer;
