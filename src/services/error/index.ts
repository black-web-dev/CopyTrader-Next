import { AsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AsyncThunkConfig } from '@/lib/error-handler';

import { AppStore } from '..';

export type ErrorStore = {
  type: string | null;
  content: any;
};

const initialState: ErrorStore = {
  type: null,
  content: {},
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setErors: (state, action) => {
      state.type = action.payload.type;
      state.content = action.payload.errors;
    },
    clearErrors: (state) => {
      state.type = null;
      state.content = {};
    },
  },
});

export function selectError<Returned, ThunkArg>(
  action: AsyncThunk<Returned, ThunkArg, AsyncThunkConfig>
) {
  return (state: AppStore) => {
    if (action.rejected.match({ type: state.error.type })) {
      return state.error.content.message;
    }
    return null;
  };
}

export function selectValidationErrors<Returned, ThunkArg>(
  action: AsyncThunk<Returned, ThunkArg, AsyncThunkConfig>
) {
  return (state: AppStore) => {
    if (
      state.error.content.type &&
      action.rejected.match({ type: state.error.type })
    ) {
      return state.error.content.errors;
    }
    return null;
  };
}

export const { setErors: setErrors, clearErrors: clearError } =
  errorSlice.actions;

const errorReducer = errorSlice.reducer;

export default errorReducer;
