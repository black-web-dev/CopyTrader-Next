import React, { ReactNode } from 'react';

import withAuth from '@/components/common/withAuth';
import Footer from '@/components/layout/default/footer';
import Header from '@/components/layout/default/header';

const Default = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <>
      <Header />
      <div className='bg-back-100 text-text-200 relative min-h-[calc(100vh_-_64px)]'>
        {children}
      </div>
      <Footer />
    </>
  );
};

export default withAuth(Default);
