import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import LoadingLogo from '@/components/common/loadingLogo';

import { useAppDispatch } from '@/services';
import {
  checkAuthAsync,
  selectAccessToken,
  selectAuthStatus,
  setStatus,
} from '@/services/auth';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const authStatus = useSelector(selectAuthStatus);
  const access_token = useSelector(selectAccessToken);

  useEffect(() => {
    if (access_token !== null) {
      dispatch(checkAuthAsync({}));
    } else {
      dispatch(setStatus('idle'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{authStatus === 'auth_check' ? <LoadingLogo /> : children}</>;
};

export default AuthProvider;
