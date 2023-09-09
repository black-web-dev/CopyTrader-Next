import clsx from 'clsx';
import React, { FC } from 'react';

import Loader from '../common/loader';

export interface ModalActionProps {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const ModalAction: FC<ModalActionProps> = ({
  children,
  isLoading,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'flex w-full items-center justify-center gap-2 rounded px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
        disabled
          ? 'bg-primary-100/50 text-text-100 cursor-not-allowed'
          : 'bg-primary-100 text-text-200 hover:bg-primary-100/50 active:scale-95'
      )}
      disabled={disabled}
      {...props}
    >
      {isLoading && <Loader />}
      {children}
    </button>
  );
};

export default ModalAction;
