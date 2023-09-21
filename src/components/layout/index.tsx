import { useRouter } from 'next/router';
import React, { ReactNode, useEffect } from 'react';

import eventEmitter from '@/lib/event.emitter';
import useNotification from '@/hooks/useNotification';

import Default from '@/components/layout/default';

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  const { pathname } = useRouter();

  const notification = useNotification();
  const router = useRouter();

  useEffect(() => {
    const onError = (message: string) => notification(message, 'error');
    const gotoLoginPage = () => router.push('/login');

    eventEmitter.on('error', onError);
    eventEmitter.on('Unauthorized', gotoLoginPage);

    return () => {
      eventEmitter.off('error', onError);
      eventEmitter.off('Unauthorized', gotoLoginPage);
    };
  }, [router, notification]);

  if (pathname.includes('register') || pathname.includes('login') || pathname.includes('password'))
    return <>{children}</>;

  return <Default>{children}</Default>;
};

export default Layout;
