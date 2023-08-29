import React from 'react';
import { useSelector } from 'react-redux';

import Login from '@/components/auth/login';

import { selectAccessToken } from '@/services/auth';

function withAuth<P>(
  Component: any,
  LoggedOutComponent: React.ComponentType = Login
): any {
  function WithAuthGuard(props: P) {
    const access_token = useSelector(selectAccessToken);

    return access_token ? <Component {...props} /> : <LoggedOutComponent />;
  }
  return WithAuthGuard;
}

export default withAuth;
