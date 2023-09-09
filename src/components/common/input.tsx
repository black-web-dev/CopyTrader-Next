import React, { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  password?: string;
  afterPrefix?: string | ReactNode;
}

const Input = (props: InputProps): JSX.Element => {
  return (
    <div className='flex w-full flex-col gap-y-2'>
      {props.label && (
        <label htmlFor='leader' className='text-text-100 text-sm capitalize'>
          {props.label}
        </label>
      )}
      <div className='flex items-center'>
        <input
          className='text-text-200 focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
          {...props}
        />
        {props.afterPrefix && (
          <div className='text-text-100'>{props.afterPrefix}</div>
        )}
      </div>
    </div>
  );
};

export default Input;
