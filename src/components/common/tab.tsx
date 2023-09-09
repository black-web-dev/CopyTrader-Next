import clsx from 'clsx';
import React, { Dispatch } from 'react';

import { ExchangeTabType } from '@/constants';

export type Props = {
  value: string;
  setValue: Dispatch<string>;
  options: ExchangeTabType[];
};

const Tab = ({ value, setValue, options }: Props) => {
  return (
    <div className='text-text-100 flex items-center rounded bg-white/5 bg-gradient-to-r'>
      {options.map((opt: ExchangeTabType, index: number) => (
        <div
          key={index}
          className={clsx(
            'hover:bg-primary-100/50 flex w-full cursor-pointer items-center justify-center gap-x-2 p-2 text-sm capitalize transition-all',
            index === 0 && 'rounded-l',
            index === options.length - 1 && 'rounded-r',
            value === opt.label &&
              'bg-primary-100 text-text-200 hover:bg-primary-100/50'
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
