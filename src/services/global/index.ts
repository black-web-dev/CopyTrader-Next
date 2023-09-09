import { createSlice } from '@reduxjs/toolkit';

import { AppStore } from '@/services/index';

export type GlobalStore = {
  isShowcopytradeModal: boolean;
};

const initialState: GlobalStore = {
  isShowcopytradeModal: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIsShowCopyTradeModal: (state, action) => {
      state.isShowcopytradeModal = action.payload;
    },
  },
});

export const { setIsShowCopyTradeModal } = globalSlice.actions;

export const selectIsShowCopyTradeModal = (state: AppStore) =>
  state.global.isShowcopytradeModal;

export default globalSlice.reducer;
