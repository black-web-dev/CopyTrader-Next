import {
  AsyncThunkPayloadCreator,
  AsyncThunkPayloadCreatorReturnValue,
} from '@reduxjs/toolkit';

import eventEmitter from './event.emitter';

export type AsyncThunkConfig = {
  rejectValue?: PayloadWithError;
  rejectWithValue: (value: PayloadWithError) => any;
  getState: () => any;
};

export type PayloadWithError = {
  error: any;
  status: number;
  statusText: string;
};

export type PayloadWithData<T> = {
  data: T;
  status: number;
  statusText: string;
};

export default function errorHandler<Returned, DataParam>(
  actionAsync: (
    data: DataParam,
    thunkAPI: AsyncThunkConfig
  ) => Promise<Returned>
): AsyncThunkPayloadCreator<
  PayloadWithData<Returned>,
  DataParam,
  AsyncThunkConfig
> {
  let callback: (
    arg: DataParam,
    thunkAPI: AsyncThunkConfig
    // eslint-disable-next-line @typescript-eslint/ban-types
  ) => AsyncThunkPayloadCreatorReturnValue<PayloadWithData<Returned>, {}>;

  // eslint-disable-next-line prefer-const
  callback = async (data: DataParam, thunkApi: AsyncThunkConfig) => {
    const { rejectWithValue } = thunkApi;
    return actionAsync(data, thunkApi)
      .then((data) => {
        return { data, status: 200, statusText: 'OK' };
      })
      .catch((error) => {
        if (error.response) {
          // Server error.
          if (error.response.data.message) {
            if (error.response.data.message === 'Unauthorized') {
              eventEmitter.emit('Unauthorized');
            } else {
              eventEmitter.emit('error', error.response.data.message);
            }
          }
          return rejectWithValue({
            error: error.response.data,
            status: error.response.status,
            statusText: error.response.statusText,
          });
        } else {
          // Frontend custom error.
          return rejectWithValue({
            error: { message: error.message },
            status: 400,
            statusText: 'Custom Error',
          });
        }
      });
  };
  return callback;
}
