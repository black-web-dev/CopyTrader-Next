import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useNotification from '@/hooks/useNotification';

import Loader from '@/components/common/loader';

import { logoutAsync } from '@/services/auth';
import { reset } from '@/services/track';

export default function Logout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const notification = useNotification();

  useEffect(() => {
    dispatch(reset());
    const action: any = logoutAsync({});
    dispatch(action);
    notification('You have successfully logged out.', 'success');
    router.push('/');
  }, [dispatch, notification, router]);

  return (
    <div className='flex min-h-[calc(100vh_-_56px)] w-full flex-col items-center justify-center gap-2 text-black dark:text-white'>
      <Loader size='50px' strokewidth={1} />
      Logging out...
    </div>
  );
}
