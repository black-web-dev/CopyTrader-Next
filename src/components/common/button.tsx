import clsx from 'clsx';
import React, { ButtonHTMLAttributes } from 'react';

import Loader from './loader';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', loading, ...rest }, ref) => {
    function createRipple(event: React.MouseEvent) {
      const button: any = event.currentTarget;

      const circle = document.createElement('span');
      circle.style.position = 'absolute';
      circle.style.borderRadius = '50%';
      circle.style.backgroundColor = '#4ea7ff26';
      circle.style.transform = 'scale(0)';
      circle.classList.add('animate-ripple'); //tailwindcss config

      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
      circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
      circle.classList.add('ripple');

      const ripple = button.getElementsByClassName('ripple')[0];

      if (ripple) {
        ripple.remove();
      }

      button.appendChild(circle);
    }

    return (
      <button
        ref={ref}
        className={clsx(
          'relative flex w-full items-center justify-center gap-2 overflow-hidden rounded px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
          rest.disabled
            ? 'bg-primary-100/50 text-text-100 cursor-not-allowed'
            : 'bg-primary-100 text-text-200 hover:bg-primary-100/50 active:scale-95',
          className
        )}
        {...rest}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          createRipple(e);
          rest.onClick && rest.onClick(e);
        }}
      >
        {!!loading && <Loader />}
        {children}
      </button>
    );
  }
);

export default Button;
