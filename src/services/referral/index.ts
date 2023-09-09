import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import errorHandler from '@/lib/error-handler';

import { AppStore } from '@/services/index';

import {
  deleteInvite,
  getInviteCode,
  getInvitedList,
  sendInvite,
} from './referral.api';

export type InviteItem = {
  id: number;
  first_name: string;
  last_name: string;
  sector: string;
  company: string;
  from_user: string;
  to_email: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
};

export type ReferralStore = {
  isFetching: boolean;
  isSending: boolean;
  isDeleting: boolean;
  deleteEmail: string;
  inviteCode: string;
  invitations: {
    count: number;
    list: InviteItem[];
  };
};

const initialState: ReferralStore = {
  isFetching: false,
  isSending: false,
  isDeleting: false,
  deleteEmail: '',
  inviteCode: '',
  invitations: {
    count: 0,
    list: [],
  },
};

export const sendInviteAsync = createAsyncThunk(
  'referral/sendInvite',
  errorHandler(sendInvite)
);

export const deleteInviteAsync = createAsyncThunk(
  'referral/deleteInvite',
  errorHandler(deleteInvite)
);

export const getInvitedListAsync = createAsyncThunk(
  'referral/getInvitedList',
  errorHandler(getInvitedList)
);

export const getInviteCodeAsync = createAsyncThunk(
  'referral/getInviteCode',
  errorHandler(getInviteCode)
);

const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    setDeleteEmail: (state, action) => {
      state.deleteEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendInviteAsync.pending, (state) => {
        state.isSending = true;
      })
      .addCase(sendInviteAsync.rejected, (state) => {
        state.isSending = false;
      })
      .addCase(sendInviteAsync.fulfilled, (state) => {
        state.isSending = false;
      })
      .addCase(deleteInviteAsync.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteInviteAsync.rejected, (state) => {
        state.isDeleting = false;
      })
      .addCase(deleteInviteAsync.fulfilled, (state) => {
        state.isDeleting = false;
      })
      .addCase(getInvitedListAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getInvitedListAsync.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(getInvitedListAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        Object.assign(state.invitations, action.payload.data);
      })
      .addCase(getInviteCodeAsync.pending, (state) => {
        state.isSending = true;
      })
      .addCase(getInviteCodeAsync.rejected, (state) => {
        state.isSending = false;
      })
      .addCase(getInviteCodeAsync.fulfilled, (state, action) => {
        state.isSending = false;
        const res = action.payload.data as any;
        state.inviteCode = res.invite_code;
      });
  },
});

export const { setDeleteEmail } = referralSlice.actions;

export const selectDeleteEmail = (state: AppStore) =>
  state.referral.deleteEmail;
export const selectIsSending = (state: AppStore) => state.referral.isSending;
export const selectIsDeleting = (state: AppStore) => state.referral.isDeleting;
export const selectIsFetching = (state: AppStore) => state.referral.isFetching;

export const selectInviteCode = (state: AppStore) => state.referral.inviteCode;
export const selectInvitations = (state: AppStore) =>
  state.referral.invitations;

export default referralSlice.reducer;
