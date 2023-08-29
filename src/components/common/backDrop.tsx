import clsx from 'clsx';
import React, { useEffect } from 'react';

interface Props {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const BackDrop = ({ onClick, children, className }: Props) => {
  useEffect(() => {
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [onClick]);

  return (
    <div
      className={clsx(className ? className : 'w-fit')}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};

export default BackDrop;
