import clsx from 'clsx';
import React, { FC } from 'react';

export interface ModalActionErrorProps {
  className?: string;
  children?: React.ReactNode;
}

const ModalError: FC<ModalActionErrorProps> = ({
  className = '',
  children,
}) => {
  if (!children) return <></>;

  return (
    <div className={clsx('text-center text-sm text-red-500', className)}>
      {children}
    </div>
  );
};

export default ModalError;
