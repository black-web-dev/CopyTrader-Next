import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';

import LoadingLogo from '@/components/common/loadingLogo';

import { useAppDispatch } from '@/services';
import {
  checkAuthAsync,
  selectAccessToken,
  selectAuthStatus,
  selectUserdata,
  setStatus,
} from '@/services/auth';
import {
  getCopyStatusAsync,
  getCopyTraderAccountAsync,
} from '@/services/trade';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const authStatus = useSelector(selectAuthStatus);
  const access_token = useSelector(selectAccessToken);
  const user = useSelector(selectUserdata);

  useEffect(() => {
    if (access_token !== null) {
      dispatch(checkAuthAsync({}));
    } else {
      dispatch(setStatus('idle'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (address && user.id > 0) {
      dispatch(
        getCopyStatusAsync({
          user_id: `${user.id}`,
          wallet: address,
        })
      );
      dispatch(
        getCopyTraderAccountAsync({
          user_id: `${user.id}`,
          wallet: address,
        })
      );
    }
  }, [address, dispatch, user]);

  return <>{authStatus === 'auth_check' ? <LoadingLogo /> : children}</>;
};

export default AuthProvider;
