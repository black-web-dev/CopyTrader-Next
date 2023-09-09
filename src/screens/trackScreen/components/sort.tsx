import clsx from 'clsx';
import React, { useState } from 'react';
import { BsSliders2 } from 'react-icons/bs';

import Datepicker from '@/components/datepicker';
import { DateValueType } from '@/components/datepicker/types';

const Duration = (): JSX.Element => {
  const [selected, setSelected] = useState('ALL');
  return (
    <>
      {['D', 'W', 'M', 'Y', 'ALL'].map((item, index) => (
        <div
          key={index}
          className={clsx(
            'cursor-default text-sm',
            selected === item ? 'font-bold text-white' : 'text-text-100'
          )}
          onClick={() => setSelected(item)}
        >
          {item}
        </div>
      ))}
    </>
  );
};

const SortOption = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [duration, setDuration] = useState<DateValueType>(null);

  return (
    <div className='relative flex items-center gap-6'>
      <div className='flex items-center gap-2'>
        <BsSliders2 />
        <div
          className='cursor-pointer whitespace-nowrap text-sm text-white'
          onClick={() => setIsOpened(!isOpened)}
        >
          Sort By
        </div>
      </div>
      <Datepicker
        showShortcuts={true}
        popoverDirection='down'
        value={duration}
        onChange={(value) => setDuration(value)}
      />
      <div className='flex items-center gap-[14px]'>
        <Duration />
      </div>
      {isOpened && (
        <div className='bg-back-200 absolute top-full p-5'>
          <div className='flex flex-col items-center'>
            <div className=''>
              <Duration />
            </div>
            <div className='flex'></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortOption;
