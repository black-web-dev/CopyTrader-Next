import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import errorHandler from '@/lib/error-handler';

import { AppStore } from '@/services/index';
import { bnum } from '@/utils';

import { closePosition, getPositions } from './position.api';

export type PositionType = {
  indextoken: string;
  islong: boolean;
  size: number;
  collateral: number;
  averageprice: number;
  leverage: number;
  limit_price: number;
  pnl: number;
  price: number;
  timestamp: string;
};

export type PositionStore = {
  isFetching: boolean;
  positions: {
    account: string;
    list: PositionType[];
  };
  sort: string;
  page: number;
  pageSize: number;
};

const initialState: PositionStore = {
  isFetching: false,
  positions: {
    account: '',
    list: [],
  },
  sort: 'size-desc',
  page: 1,
  pageSize: 10,
};

export const getPositionsAsync = createAsyncThunk(
  'positions/getPositions',
  getPositions
);

export const closePositionAsync = createAsyncThunk(
  'positions/closePosition',
  errorHandler(closePosition)
);

const positionSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPositionsAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getPositionsAsync.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(getPositionsAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        const result: any = action.payload;
        if (result.account) {
          Object.assign(state.positions, action.payload);
        } else {
          state.positions = {
            account: '',
            list: [],
          };
        }
      })
      .addCase(closePositionAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(closePositionAsync.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(closePositionAsync.fulfilled, (state) => {
        state.isFetching = false;
      });
  },
});

export const { setSort, setPage } = positionSlice.actions;

export const selectPositionData = (state: AppStore) => {
  const sorted: PositionType[] = [...state.position.positions.list];

  const sort = state.position.sort.split('-');
  const sortKey = sort[0];
  const sortDireaction = sort[1];

  if (sortKey && sortDireaction) {
    sorted.sort((a: PositionType, b: PositionType) => {
      const compareA = bnum(a[sortKey as keyof PositionType]);
      const compareB = bnum(b[sortKey as keyof PositionType]);

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

  const count = sorted.length;
  const start = (state.position.page - 1) * state.position.pageSize;
  const end = Math.min(
    (state.position.page - 1) * state.position.pageSize +
      state.position.pageSize,
    count
  );

  return {
    count,
    list: sorted.slice(start, end),
  };
};

export const selectPage = (state: AppStore) => state.position.page;
export const selectPageSize = (state: AppStore) => state.position.pageSize;
export const selectSort = (state: AppStore) => state.position.sort;

export const selectIsFetching = (state: AppStore) => state.position.isFetching;

export default positionSlice.reducer;
