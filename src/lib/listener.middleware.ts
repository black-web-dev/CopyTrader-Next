import { isRejectedWithValue } from '@reduxjs/toolkit';
import { createListenerMiddleware } from '@rtk-incubator/action-listener-middleware';

import { setErrors } from '@/services/error';

import { PayloadWithError } from './error-handler';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: async (action, listenerApi) => {
    const { error } = action.payload as PayloadWithError;
    listenerApi.dispatch(setErrors({ type: action.type, errors: error }));
  },
});

export default listenerMiddleware;
