import * as React from 'react';

import Logo from '~/svg/logo.svg';

export default function NotFoundPage() {
  return (
    <div className='flex min-h-[calc(100vh_-_64px)] flex-auto items-center justify-center'>
      <div className='flex flex-col'>
        <div className='mb-4 flex items-center justify-between font-semibold text-white'>
          <Logo className='h-[45px] w-[75px]' />
          <p>404 error</p>
        </div>
        <div className='my-2 text-center text-5xl font-bold text-white'>
          <p>We can't find that page</p>
        </div>
        <div className='my-2 text-center text-base text-white'>
          <p>
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>
      </div>
    </div>
  );
}
