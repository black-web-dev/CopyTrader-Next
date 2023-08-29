import React from 'react';

import Logo from '~/svg/logo_footer.svg';

const LoadingLogo = (): JSX.Element => {
  return (
    <div className='flex h-screen w-full items-center justify-center bg-back-100'>
      <Logo className='h-[150px] w-[250px]' />
    </div>
  );
};

export default LoadingLogo;
