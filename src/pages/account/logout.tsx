import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useNotification from '@/hooks/useNotification';

import { logoutAsync } from '@/services/auth';

import LoadingIndicator from '~/svg/loadingIndicator.svg';

export default function Logout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const notification = useNotification();

  useEffect(() => {
    const action: any = logoutAsync({});
    dispatch(action);
    notification('You have successfully logged out.', 'success');
    router.push('/');
  }, [dispatch, notification, router]);

  return (
    <div className='flex min-h-[calc(100vh_-_56px)] w-full flex-col items-center justify-center gap-2 text-black dark:text-white'>
      <LoadingIndicator />
      Logging out...
    </div>
  );
}
