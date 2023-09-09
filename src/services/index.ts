import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import listenerMiddleware from '@/lib/listener.middleware';

import authReducer, { AuthStore } from './auth';
import balanceReducer, { BalanceStore } from './balance';
import dashboardReducer, { DashboardStore } from './dashboard';
import { ErrorStore } from './error';
import globalReducer, { GlobalStore } from './global';
import pairReducer, { PairStore } from './pair';
import positionReducer, { PositionStore } from './position';
import referralReducer, { ReferralStore } from './referral';
import trackReducer, { TrackStore } from './track';
import tradeReducer, { TradeStore } from './trade';

export type AppStore = {
  auth: AuthStore;
  balance: BalanceStore;
  dashboard: DashboardStore;
  global: GlobalStore;
  trade: TradeStore;
  track: TrackStore;
  pair: PairStore;
  position: PositionStore;
  referral: ReferralStore;
  error: ErrorStore;
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    balance: balanceReducer,
    dashboard: dashboardReducer,
    global: globalReducer,
    trade: tradeReducer,
    track: trackReducer,
    pair: pairReducer,
    position: positionReducer,
    referral: referralReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
