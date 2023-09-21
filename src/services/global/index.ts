import { createSlice } from '@reduxjs/toolkit';

import { AppStore } from '@/services/index';

export type GlobalStore = {
  isShowcopytradeModal: boolean;
  isShowInviteModal: boolean;
};

const initialState: GlobalStore = {
  isShowcopytradeModal: false,
  isShowInviteModal: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIsShowCopyTradeModal: (state, action) => {
      state.isShowcopytradeModal = action.payload;
    },
    setIsShowInviteModal: (state, action) => {
      state.isShowInviteModal = action.payload;
    },
  },
});

export const { setIsShowCopyTradeModal, setIsShowInviteModal } =
  globalSlice.actions;

export const selectIsShowCopyTradeModal = (state: AppStore) =>
  state.global.isShowcopytradeModal;

export const selectIsShowInviteModal = (state: AppStore) =>
  state.global.isShowInviteModal;

export default globalSlice.reducer;
