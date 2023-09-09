import clsx from 'clsx';
import React from 'react';

const Tooltip = ({
  isTag = true,
  content,
  position = 'right',
  children,
}: {
  isTag: boolean;
  content: string;
  position: string;
  children: React.ReactNode;
}) => {
  let positionClassName = '';
  let arrowClassName = '';

  switch (position) {
    case 'left':
      positionClassName = 'right-full top-1/2 -translate-y-1/2';
      arrowClassName =
        "before:absolute before:top-1/2 before:right-[-6px] before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:content-['']";
      break;
    case 'right':
      positionClassName = 'left-full top-1/2 -translate-y-1/2';
      arrowClassName =
        "before:absolute before:top-1/2 before:left-[-6px] before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:content-['']";
      break;
    case 'top':
      positionClassName = 'bottom-full';
      arrowClassName =
        "before:absolute before:left-1/2 before:bottom-[-6px] before:h-3 before:w-3 before:-translate-x-1/2 before:rotate-45 before:content-['']";
      break;
    case 'bottom':
      positionClassName = 'top-full';
      arrowClassName =
        "before:absolute before:left-1/2 before:top-[-6px] before:h-3 before:w-3 before:-translate-x-1/2 before:rotate-45 before:content-['']";
      break;
    default:
      positionClassName = 'top-full ';
      break;
  }
  return (
    <div className='group relative flex cursor-pointer flex-col items-center'>
      {children}
      <div
        className={clsx(
          'absolute z-20 hidden flex-col items-center group-hover:flex',
          positionClassName
        )}
      >
        <div
          className={clsx(
            'relative z-10 m-2 bg-gray-600 p-3 text-xs text-white',
            arrowClassName,
            isTag ? 'before:bg-gray-600' : 'before:bg-transparent'
          )}
        >
          <div className='flex min-w-[100px] max-w-[300px] flex-col items-center justify-center gap-y-2'>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
