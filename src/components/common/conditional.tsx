import clsx from 'clsx';
import React from 'react';

import Loader from './loader';

const Conditional = ({
  className,
  loadingSize = '40px',
  isLoading,
  children,
}: {
  className?: string;
  loadingSize?: string;
  isLoading: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className={clsx('relative h-full w-full', className)}>
      {isLoading ? (
        <div className='absolute inset-0 flex items-center justify-center'>
          <Loader size={loadingSize} />
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default Conditional;
