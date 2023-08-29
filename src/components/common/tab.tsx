import { ExchangeTabType } from '@/constants';
import clsx from 'clsx';
import React, { Dispatch } from 'react';

export type Props = {
  value: string;
  setValue: Dispatch<string>;
  options: ExchangeTabType[];
};

const Tab = ({ value, setValue, options }: Props) => {
  return (
    <div className='from-gradient-100 to-gradient-200 text-text-100 flex items-center rounded bg-gradient-to-r'>
      {options.map((opt: ExchangeTabType, index: number) => (
        <div
          key={index}
          className={clsx(
            'hover:bg-hover-100 flex w-full cursor-pointer items-center justify-center gap-x-2 p-2 text-sm capitalize transition-all',
            index === 0 && 'rounded-l',
            index === options.length - 1 && 'rounded-r',
            value === opt.label &&
              'bg-primary-100 text-text-200 hover:bg-primary-100'
          )}
          onClick={() => setValue(opt.label)}
        >
          {opt.icon}
          {opt.label}
        </div>
      ))}
    </div>
  );
};

export default Tab;
