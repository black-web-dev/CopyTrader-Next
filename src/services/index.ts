import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import listenerMiddleware from '@/lib/listener.middleware';

import authReducer, { AuthStore } from '@/services/auth';
import balanceReducer, { BalanceStore } from '@/services/balance';
import { ErrorStore } from '@/services/error';
import tradeReducer, { TradeStore } from '@/services/trade';

import positionReducer, { PositionStore } from './positions';

export type AppStore = {
  auth: AuthStore;
  balance: BalanceStore;
  trade: TradeStore;
  position: PositionStore;
  error: ErrorStore;
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    balance: balanceReducer,
    trade: tradeReducer,
    position: positionReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
