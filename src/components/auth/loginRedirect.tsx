import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { isRedirectRouteAllowed } from '@/hooks/useRoute';

import LoadingIndicator from '~/svg/loadingIndicator.svg';

export default function LoginRedirect(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const backRoute = router.query.back as string;
    router.push(
      backRoute && isRedirectRouteAllowed(backRoute) ? backRoute : '/'
    );
  }, [router]);

  return (
    <div className='flex min-h-[calc(100vh_-_56px)] w-full flex-col items-center justify-center gap-2 text-black dark:text-white '>
      <LoadingIndicator />
      Redirecting...
    </div>
  );
}
